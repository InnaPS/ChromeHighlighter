
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
                sendResponse(update(request));
        }
        return true;

    });

}

function update(newRectangle) {
    var link = newRectangle.url;
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
        var modelNew = render(link);
        return modelNew;
}

function render(currentUrl) {
    var modelToRender = null;
        for (key in config) {
            if (key === currentUrl) {
                modelToRender = config[key];
            }
        }
    return modelToRender;
}


setup();

