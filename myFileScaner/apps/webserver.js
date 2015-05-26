exports.start = function(fileSearch) {
    var express = require("express");
    var app = express();
    var io= require('socket.io');

    app.get('/fileInfo', function(req, res) {
        var result = fileSearch.getFileTree(req.query.basicdir, req.query.path);
        console.log(req.query.path);
        res.send(result);
    })

    app.post('/fileInfo', function(req, res) {
        var path = req.query.path;

        if (!path) {
            res.send("invalid param");
        } else {
            res.send(fileSearch.init(path));
        }
    })
    app.get('/*.*', function(req, res) {
        var options = {
            root: './webapp/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        var fileName = req.path;
        res.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
            else {
                console.log('Sent:', fileName);
            }
        });
    });
    var server = app.listen('3000');
    return server;
}
