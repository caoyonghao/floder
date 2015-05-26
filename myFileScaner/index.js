//require modules
var server = require('./apps/webserver.js');
var fileSearch = require('./apps/fileSearch.js');
var socketServer = require('./apps/socketServer.js');
//init express server
var app = server.start(fileSearch);
//add socket io
socketServer.start(app);