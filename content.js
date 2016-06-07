function init() {

    var controller = {
        view: null,
        toggleSelection: function (isShift) {
            document.body.className = isShift && 'non-selectable' || '';
        },
        create: function (isShift, x, y) {

            if (!isShift) return;

            controller.start = {
                x: x,
                y: y
            };
            controller.end = {
                x: x,
                y: y
            };
            controller.view = document.createElement('div');
            controller.view.id = 'current-selection';
            controller.view.className = 'viewRect';
            document.body.appendChild(controller.view);
        },
        update: function (x, y) {
            controller.end = {x: x, y: y};
            controller.refresh();
        },
        refresh: function () {
            var model = controller.getModel();
            controller.view.style.left = model.left + 'px';
            controller.view.style.top = model.top + 'px';
            controller.view.style.width = model.width + 'px';
            controller.view.style.height = model.height + 'px';
        },
        finish: function () {
            controller.toggleSelection(false);
            document.body.removeChild(document.getElementById('#current-selection'));
            chrome.runtime.sendMessage({type: 'update', model: controller.getModel()}, function (response) {
                //render command is procceded here
            });
        },
        getModel: function () {
            return {
                left: controller.end.x - controller.start.x < 0 ? controller.end.x : controller.start.x,
                top: controller.end.y - controller.start.y < 0 ? controller.end.y : controller.start.y,
                width: ~~(controller.end.x - controller.start.x),
                height: ~~(controller.end.y - controller.start.y)
            }
        }
    };

    document.body.onkeydown = function (e) {
        controller.toggleSelection(e.shiftKey);
    };

    document.body.onmousedown = function (e) {
        controller.create(e.shiftKey, e.pageX, e.pageY)
    };

    document.body.onmousemove = function (e) {
        controller.update(e.pageX, e.pageY)
    };

    document.body.onmouseup = function (e) {
        controller.finish(e);
    };

    document.body.onkeyup = function (e) {
        controller.finish(e);
    };

}


function render(model) {
    var oldRects = document.querySelectorAll('.rectangle');
    if (oldRects) {
        for (var k = 0; k < oldRects.length; k++) {
            document.body.removeChild(oldRects[k]);
        }
    }
    for (var i = 0; i < model.model.length; i++) {
        var restoredRect = document.createview('div');
        restoredRect.className = 'rectangle';
        restoredRect.style.left = model.model[i].x;
        restoredRect.style.top = model.model[i].y;
        restoredRect.style.width = model.model[i].width;
        restoredRect.style.height = model.model[i].height;
        document.body.appendChild(restoredRect);
    }

}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.toggle)
            init();
        return true;
    });