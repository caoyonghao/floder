var EventEmitter = require('events').EventEmitter;
var myEventEmitter = {};

myEventEmitter = new EventEmitter();

exports.getInstance = function () {
    function trigger(eventID, data) {
        myEventEmitter.emit(eventID, data);
    }

    function on(eventID, callback) {
        myEventEmitter.on(eventID, function(e) {
            callback(e);
        });

    }

    return {trigger: trigger, on: on}
}