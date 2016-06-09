var config = {};

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

    chrome.browserAction.onClicked.addListener(function(tabId) {
        updateState(tabId);
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
    config[tab.url] = config[tab.url] || {};
    config[tab.url].enable = false;
    config[tab.url].data = [];
    config[tab.url].data.push(model);
    chrome.storage.sync.set({'highlighter': config}, function() {
    });
    console.log(config);
}

function render(tab) {
    send(tab, {command: 'render', model: config[tab.url]? (config[tab.url].enable ? config[tab.url].data || [] : []) : []});
}

function send(tab, msg) {
    chrome.tabs.sendMessage(tab.id, msg);
}

function updateState(tab) {
    if(config[tab]) {
        if(config[tab].enable) {
            config[tab].enable = false;
            chrome.browserAction.setIcon({path: "images/icon-off.png"});
        } else {
            config[tab].enable = true;
            chrome.browserAction.setIcon({path: "images/icon-on.png"});
        }
        render(tab);
    }

}

chrome.storage.sync.get("highlighter", function(_config) {
    config = _config;
    setup();
});

