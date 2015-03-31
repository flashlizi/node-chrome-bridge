A Chrome Extension/App Bridge for NodeJS
=============

This NodeJS library helps you to communicate with chrome extension/app.

### Usage

```
var chromeBridge = require('chrome-bridge');

//send a message to chrome
chromeBridge.sendMessage({text:'hello chrome!'});

//listen message from chrome
chromeBridge.on('message', function(msg){
    console.log('received from chrome:', msg);
});
```

### APIs

* `sendMessage(msgObject)` - Send a message to chrome extension/app. The `msgObject` must be a JSON object.
* `on('message', handler)` - Listen messages from chrome extension/app.


### Demo

There is a simple demo `Web Terminal`, you can check it in the `demo` folder.

* If you don't have `NodeJS` installed, install it first.
* Install native host. open a terminal, cd to the `/demo/host` directory, run command `sh install_host.sh`.
* Open a tab with `chrome://extensions/` in chrome, load the extension with `/demo` directory, the you will see a `cube` popup icon on the right of navigation bar.
* Click and open a page, play any commands on it, such as `node -v`.