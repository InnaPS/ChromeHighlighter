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

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        chrome.tabs.get(activeInfo.tabId, function(tab){
            if (config[tab.url] != undefined) {
                if (config[tab.url].enable) {
                    render(tab);
                    chrome.browserAction.setIcon({path: "images/icon-on.png"});
                } else {
                    render(tab);
                    chrome.browserAction.setIcon({path: "images/icon-off.png"});
                }
            } else {
                config[tab.url] = {};
                config[tab.url].enable = false;
                render(tab);
                chrome.browserAction.setIcon({path: "images/icon-off.png"});
            }
        });
    });

    chrome.runtime.onMessage.addListener(
        function (msg, sender) {
            if (msg.command === 'update') {
                update(sender.tab, msg.model);
                render(sender.tab);
            }
            if (msg.command === 'updateModel') {
                updateModel(sender.tab, msg.model);
                render(sender.tab);
            }
            return true;

        });

    chrome.browserAction.onClicked.addListener(function(tab) {
        if (config[tab.url] === undefined) {
            config[tab.url] = {};
            config[tab.url].enable = true;
            render(tab);
            chrome.browserAction.setIcon({path: "images/icon-on.png"});

        } else {
            if (!config[tab.url].enable) {
                config[tab.url].enable = true;
                render(tab);
                chrome.browserAction.setIcon({path: "images/icon-on.png"});
            } else {
                config[tab.url].enable = false;
                render(tab);
                chrome.browserAction.setIcon({path: "images/icon-off.png"});
            }
        }
    });

}

function update(tab, model) {
    config[tab.url] = config[tab.url] || {};
    if (config[tab.url].data) {
        config[tab.url].data.push(model)
    } else {
        config[tab.url].data = [];
        config[tab.url].data.push(model) ;
    }
        chrome.storage.sync.set(config, function() {
    });

}

function updateModel(tab, model){
    config[tab.url].data = model;
    chrome.storage.sync.set(config, function() {
    });
}

function render(tab) {
    send(tab, {command: 'render', enable: config[tab.url] ? config[tab.url].enable : false, model: config[tab.url] ? (config[tab.url].enable ? config[tab.url].data || [] : []) : []});
}

function send(tab, msg) {
    chrome.tabs.sendMessage(tab.id, msg);
}

chrome.storage.sync.get(config, function(_config) {
    config = _config;
    setup();
});
