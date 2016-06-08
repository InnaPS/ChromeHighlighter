var config = {};
var toggle = true;

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
    send(tab, {command: 'render', model: config[tab.url] || []});
}

function send(tab, msg) {
    chrome.tabs.sendMessage(tab.id, msg);
}


chrome.storage.sync.get("highlighter", function(_config) {
    config = _config;
    setup();
});

