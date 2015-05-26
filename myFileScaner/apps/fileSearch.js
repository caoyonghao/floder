//require depency
var async = require("async");
var fs = require('fs');
var path = require('path');

var eventCenter = require('./eventCenter.js').getInstance();

var totolSize = 0;
var fileTree ={}

function Node(name) {
    this.name = name;
    this.sons = [];
    this.father = {};
    this.size = 0;
}

Node.prototype = {
    addSon: function(newSon) {
        this.sons.push(newSon);
        this.size += newSon.size;
        this.isHasSon = false;
    },
    addFather: function(newFather) {
        this.father = newFather;
    },
    setSize: function(newSize){
        this.size = newSize;
    },
    setHasSon: function(isHasSon) {
        this.isHasSon = isHasSon;
    }
}

function listFile (dir) {
    var fileList = getFlieList(dir);
    var result = [];
    fileList.forEach(function(file){
        var statObj = fs.statSync(file);
        var fileObj = {};
        fileObj.name = file;
        fileObj.isDirectory = statObj.isDirectory();
        fileObj.size = statObj.size;
        result.push(fileObj);
    })
    return result;
}

function getSize(dir, file) {
    dir = path.resolve(dir, file);
    var fileList = getFlieList(dir);
    var father = new Node(file);
    fileList.forEach(function(file) {
        if (file.indexOf('.') == 0) {
            return;
        }
        try {
            var statObj = fs.statSync(dir + '/' + file);
            if (statObj.isDirectory()) {
                //loop
                var tmpSon = getSize(dir, file);
                tmpSon.setHasSon(true);
                father.addSon(tmpSon);
            } else {
                totolSize += statObj.size;
                var son = new Node(file);
                son.setSize(statObj.size);
                father.addSon(son);
            }
        } catch(e) {
            console.log("myFileScaner :: fileSearch :: getInfoFromTree ERROR: " + e);
        }
    });
    return father;
}

function getFlieList(dir) {
    var readdir = fs.readdirSync(dir);
    return readdir;
}

function reachNode(paths, fileTree, path) {
    var tmpTree = fileTree;
    for (var i = 1; i < paths.length; i++) {
        var isExit = false;
        tmpTree.sons.forEach(function (node) {
            if (node.name == paths[i]) {
                tmpTree = node;
                isExit = true;
            }
        })
        if (!isExit) {
            console.log("myFileScaner :: fileSearch :: getInfoFromTree ERROR: FILE NOT FOUND!" + path);
            throw(new Error("myFileScaner :: fileSearch :: getInfoFromTree ERROR: FILE NOT FOUND!" + path));
        }
    }
    return tmpTree;
}

function convertNode(node) {
    var tmpSons = [];
    var tmpNode = {};
    tmpNode.size = node.size;
    tmpNode.name = node.name;
    node.sons.forEach(function(son) {
        var tmpObj = {};
        tmpObj.size = son.size;
        tmpObj.name = son.name;
        tmpObj.isHasSon = son.isHasSon;
        tmpObj.sons = [];
        tmpSons.push(tmpObj);
    })
    tmpNode.sons = tmpSons;
    return tmpNode;
}

function getInfoFormTree(basicdir, path) {
    //parse path
    var paths = path.split("/");
    var result = [];
    var tmpTree;
    if(!fileTree[basicdir].sons) {
        return "need to init!";
    }
    tmpTree = reachNode(paths, fileTree[basicdir], path);

    return convertNode(tmpTree);
}

exports.getPath = function () {
    return listFile('.');
}

exports.getFileTree = function(basicdir, path) {
    return getInfoFormTree(basicdir, path);
}
exports.init = function(targetPath) {
    var absolutePath = path.resolve(targetPath, "");
    eventCenter.trigger("filescanner.running", "start");
    if (!fileTree[absolutePath]) {
        console.log("myFileScaner :: fileSearch :: init ing..." + targetPath);
        fileTree[absolutePath] = getSize(targetPath, "");
        console.log("myFileScaner :: fileSearch :: init finish..." + targetPath);
    } else {
        console.log("myFileScaner :: fileSearch :: init is inited before");
        console.log("if the page did not refresh, please click the 'GO' button aggin, or refresh the page and search the same path again");
    }
    eventCenter.trigger("filescanner.running", "finish");
    return path.resolve(targetPath, "");
}