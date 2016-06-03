
var config = {};

function setup() {
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.tabs.insertCSS(null, {file: "mainStyles.css"});
            chrome.tabs.executeScript(null, {
                code: 'var config = ' + JSON.stringify(config)
            }, function() {
                chrome.tabs.executeScript(null, { file: "lodash.js" }, function() {
                    chrome.tabs.executeScript(null, { file: "content.js" })
                });
            });
        }
    });

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.type){
                update(request.type);
        }
        return true;

    });

}

function update(newRectangle) {
    var url,
        model = _.clone(newRectangle.model);
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        url = tabs[0].url;
        if (_.isEmpty(config)) {
            config[url] = [model];
        } else {
            for (key in config) {
                if (key === url) {
                    config[key].push(model);
                }
            }
        }
        render(url);
    });

}

function render(currentUrl) {
    for (key in config) {
        if (key === currentUrl) {
            var modelToRender = {
                name: 'render',
                model: config[key]
            };
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {model: modelToRender}, function(response) {

                });
            });
        }
    }
}

setup();

