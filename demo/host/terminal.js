#!/usr/local/bin/node

var chromeBridge = require('../../lib/chrome-bridge');
var spawn = require('child_process').spawn;

var msgHandlers = {};
var DEAULT_SPAWN_ENV_PATH = '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin';

main();

function main(){
    chromeBridge.on('message', function(msg){
        var handler = msgHandlers[msg.type];
        handler && handler(msg);
    });

    addMessageHandler('cmd', execCmd);

    //notify the bridge is connected
    chromeBridge.sendMessage({type:'connected'});

    process.on('uncaughtException', function(err){
        chromeBridge.sendMessage({type:'error', data:err.toString()});
    });
}

function execCmd(cmd){
    cmd = typeof cmd === 'object' ? cmd.data : cmd;
    var cmdArr = cmd.split(' ');

    var command = spawn(cmdArr[0], cmdArr.slice(1), {
        env: {
            PATH: DEAULT_SPAWN_ENV_PATH
        }
    });
    command.stdout.on('data', function(data){
        chromeBridge.sendMessage({type:'cmd', data:data.toString()});
    });
    command.stderr.on('data', function(data){
        chromeBridge.sendMessage({type:'cmd', data:data.toString()});
    });
}

function addMessageHandler(cmd, handler){
    msgHandlers[cmd] = handler;
}