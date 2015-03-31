/*
 * ChromeBridge
 *
 * Copyright (c) 2015 flashlizi
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * A node bridge for communicating with chrome extensions/apps.
 * @class ChromeBridge
 * @fires ChromeBridge#message When receives a message from chrome extenstions/apps.
 */
function ChromeBridge(){
    EventEmitter.call(this);

    var self = this;
    var input = new Buffer(0);

    process.stdin.on('readable', function(){
        var chunk = process.stdin.read() || new Buffer(0);
        input = Buffer.concat([input, chunk]);
        var len = input.length;

        while(len > 4){
            var msgLen = input.readUInt32LE(0), dataLen = msgLen + 4;
            if(len >= dataLen){
                var content = input.slice(4, dataLen);
                if(content){
                    content = JSON.parse(content.toString());
                    self.emit('message', content);
                }
                len -= dataLen;
                input = input.slice(dataLen);
            }
        }
    });
}
util.inherits(ChromeBridge, EventEmitter);

/**
 * Send a message to chrome.
 * The data format is: 4 bytes message length + string serialized JSON message object.
 * @param  {Object} msg message to sent, it MUST be a JSON object.
 */
ChromeBridge.prototype.sendMessage = function(msg){
    var buffer = new Buffer(JSON.stringify(msg));
    var header = new Buffer(4);
    header.writeUInt32LE(buffer.length, 0);

    var data = Buffer.concat([header, buffer]);
    process.stdout.write(data);
};

/**
 * When receives a message from chrome extenstions/apps.
 * @event ChromeBridge#message
 * @type {object} a JSON message object.
 */

module.exports = new ChromeBridge();