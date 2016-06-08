
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
                sendResponse(update(request.model));
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
            config[link] = [newRectangle];
        } else {
            for (key in config) {
                if (key === link) {
                    config[key].push(newRectangle);
                } else {
                    config[link] = [newRectangle];
                }
            }
        }
        chrome.storage.local.set(config, function () { });
        var modelNew = render(link);
        console.log(modelNew);
        return modelNew;
    }

}

function render(currentUrl) {
    chrome.storage.local.get(config, function (result) {
        for (key in result) {
            if (key === currentUrl) {
                var modelToRender = result[key];

                return modelToRender;
            }
        }
    });
}


setup();

