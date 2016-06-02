
var config = {allPages: []};

function setup() {
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.tabs.insertCSS(null, {file: "mainStyles.css"});
            chrome.tabs.executeScript(null, {
                code: 'var config = ' + JSON.stringify(config)
            }, function() {
                chrome.tabs.executeScript(null, { file: "content.js" })
            });
        }
    });



    var toggle = true;
    chrome.runtime.onConnect.addListener(function(port) {
        //port.postMessage({toggle: toggle});
        port.onMessage.addListener(function(msg) {
            if (msg.joke == "Knock knock")
                port.postMessage({question: "Who's there?"});
            if (msg.newRect)
                update(msg.newRect);
        });
        port.postMessage({checking: 'one two'});
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
            console.log('from if', config);
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
            console.log('from else',  config);
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
            console.log(modelToRender);
            //port.postMessage({checking: 'one two'});
            //port.postMessage({modelToRender: modelToRender});
        }
    }
}

setup();





