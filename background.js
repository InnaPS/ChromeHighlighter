var config = {};
var toggle = false;

function setup() {

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.tabs.insertCSS(null, {file: "mainStyles.css"});
            chrome.tabs.executeScript(null, {file: "lodash.js"}, function () {
                chrome.tabs.executeScript(null, {file: "content.js"}, function() {
                    render(tab);
                });
            });
        }
    });

    chrome.browserAction.onClicked.addListener(function(tabId, changeInfo, tab) {
        toggle = !toggle;
        if(toggle){
            chrome.browserAction.setIcon({path: "images/icon-on.png"});
            render(tabId);
        }
        else{
            chrome.browserAction.setIcon({path: "images/icon-off.png"});
            render(tabId);
        }

    });

    chrome.runtime.onMessage.addListener(
        function (msg, sender) {
            if (msg.command === 'update') {
                update(sender.tab, msg.model);
                render(sender.tab);
            }
            return true;

        });

}

function update(tab, model) {
    config[tab.url] = config[tab.url] || [];
    config[tab.url].push(model);
    chrome.storage.sync.set({'highlighter': config}, function() {
    });
}

function render(tab) {
    send(tab, {command: 'render', model: toggle ? config[tab.url] || [] : []});
}

function send(tab, msg) {
    chrome.tabs.sendMessage(tab.id, msg);
}


chrome.storage.sync.get("highlighter", function(_config) {
    config = _config;
    setup();
});

