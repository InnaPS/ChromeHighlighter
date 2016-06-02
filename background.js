
var config = {allPages: []};

function setup() {
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.tabs.insertCSS(null, {file: "mainStyles.css"});
            chrome.tabs.executeScript(null, {
                code: 'var config = ' + JSON.stringify(config)
            }, function() {
                chrome.tabs.executeScript(null, { file: "content.js" });
            });
        }
    });



    var toggle = true;
    chrome.runtime.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(msg) {
            if (msg.newRect)
                update(msg.create);
        });
    });

}

function update(newRectangle) {
    var url;

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        url = tabs[0].url;
        if (config.allPages.length == 0) {
            config.allPages.push({
                url: url,
                name: newRectangle.name,
                model: [{
                    x: newRectangle.model.x,
                    y: newRectangle.model.y,
                    width: newRectangle.model.width,
                    height: newRectangle.model.height
                }]
            });
        } else {
            for (var i = 0; i < config.allPages.length; i++) {
                if (config.allPages[i].url == url) {
                    config.allPages[i].model.push({
                        x: newRectangle.model.x,
                        y: newRectangle.model.y,
                        width: newRectangle.model.width,
                        height: newRectangle.model.height
                    });
                }
            }
        }
        render(url);
    });

}

function render(currentUrl) {
    for (var i = 0; i < config.allPages.length; i++) {
        if (config.allPages[i].url == currentUrl) {
            var modelToRender = {
                name: 'render',
                model: config.allPages[i].model
            };
        }
    }
}

setup();





