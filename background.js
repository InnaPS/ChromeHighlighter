
var config = {};
var toggle = true;

function setup() {
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.tabs.insertCSS(null, {file: "mainStyles.css"});
            chrome.tabs.executeScript(null, { file: "lodash.js" }, function() {
                chrome.tabs.executeScript(null, { file: "content.js" })
            });
        }
    });

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            if (request.type == 'update'){
                update(request.model);
        }
        return true;

    });

}

function update(newRectangle) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        updateModel(tabs[0].url);
    });

    function updateModel(url) {
        var link = url;
        if (_.isEmpty(config)) {
            config[link] = [newRectangle.model];
        } else {
            for (key in config) {
                if (key === link) {
                    config[key].push(newRectangle.model);
                } else {
                    config[link] = [newRectangle.model];
                }
            }
        }
        chrome.storage.local.set(config, function () { });
        render(link);
    }

}

function render(currentUrl) {
    chrome.storage.local.get(config, function (result) {
        for (key in result) {
            if (key === currentUrl) {
                var modelToRender = {
                    name: 'render',
                    model: result[key]
                };
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {model: modelToRender}, function(response) {

                    });
                });
            }
        }
    });
}


setup();

