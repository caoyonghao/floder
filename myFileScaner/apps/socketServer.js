var evnetCenter = require('./eventCenter.js').getInstance();
var express = require("express");
var socketApp = express();
var io;
exports.start = function(app) {
    var mySocket;
    io = require('socket.io').listen(socketApp.listen(3001));

    io.sockets.on('connect', function (socket) {
        //console.log('----------------socketio connect---------' + socket);
        mySocket = socket;
        //keepAlive();
    });
    io.sockets.on('disconnect', function(){
        console.log('disconnect');
    });

    io.sockets.on('connect_failed', function(){
        console.log('connect_failed');
    });
    io.sockets.on('connecting', function(){
        console.log('connecting');
    });
    io.sockets.on('anything', function(){
        console.log('anything');
    });
    io.sockets.on('connect', function(){
        console.log('connect');
    });
    evnetCenter.on("filescanner.running", sendStatus);

    function sendStatus(status) {
        //console.log("socketServer::sendPercentage : " + status);
        if (status == 'finish') {
            //fix the bug of pendding socket io
            setTimeout(function() {
                mySocket.emit('filescaner.running', { status: 'finish' });
            }, 100)
        } else {
            mySocket.emit('filescaner.running', { status: status });
        }
    }
    function keepAlive() {
        setInterval(function() {
            sendStatus("keep-alive");
        }, 1000);
    }
}
