;(function(){

window.onload = init;

var output, input;
var webTerminal;
var INDICATOR = '>';

function init(){
    output = $('.output');
    input = $('.input input');

    //auto focus input
    input.focus();
    input.placeholder = 'Type your command here...';
    $('.input .indicator').textContent = '>';
    
    //get web terminal instance in background
    chrome.runtime.getBackgroundPage(function(bg){
        webTerminal = bg.webTerminal;
        webTerminal.on('error', function(err){
            outputContent(err.data);
        });
        webTerminal.on('cmd', function(cmd){
            outputContent(cmd.data);
        });
    });

    //input listener
    document.addEventListener('keydown', function(e){
        var keyCode = e.keyCode;
        switch(keyCode){
            case 13:
            if(input === document.activeElement){
                var content = input.value;
                outputContent(INDICATOR + ' ' + content);
                input.value = '';
                input.placeholder = '';
                exec(content);
            }
            break;
        }
    });
}

function outputContent(content, notNewline){
    content =  typeof content === 'object' ? JSON.stringify(content) : content;
    var newline = '<br/>';
    content = content.split('\n').join(newline);
    output.innerHTML += content + (notNewline ? '' : '<br/>');
    setTimeout(autoscroll, 10);
}

function exec(cmd){
    if(webTerminal){
        webTerminal.exec(cmd);
    }
}

function autoscroll(){
    window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
}

function $(selector, selectAll, owner){
    owner = owner || document;
    return selectAll ? owner.querySelectorAll(selector) : owner.querySelector(selector);
}

})();