;(function(exports){

var NATIVE_HOST_NAME = 'web.terminal';
var nativePort = null;
var msgHandlers = {};

function init(){
    chrome.browserAction.onClicked.addListener(function(tab){
        chrome.tabs.create({url:'main.html'});
    });

    console.log('connect:', NATIVE_HOST_NAME);
    nativePort = chrome.runtime.connectNative(NATIVE_HOST_NAME);
    nativePort.onMessage.addListener(onNativeMessage);
    nativePort.onDisconnect.addListener(onDisconnected);
}

function onDisconnected(){
    console.log("failed to connect: ", chrome.runtime.lastError.message);
    nativePort = null;
}

function onNativeMessage(message){
    console.log('Receive:', message);

    var type = message.type;
    var handler = msgHandlers[type];
    if(handler){
        handler(message);
    }
}

function exec(cmd){
    console.log('exec:', cmd);
    nativePort.postMessage({type:'cmd', data:cmd});
}

function addMessageHandler(type, handler){
    msgHandlers[type] = handler;
}

window.addEventListener('load', function(){
    init();
});

exports.webTerminal = {
    exec: exec,
    on: addMessageHandler
};

})(window);