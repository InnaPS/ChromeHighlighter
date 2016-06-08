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
        update: function (isShift, x, y) {
            controller.end = {x: x, y: y};
            if (controller.view != null) {
                controller.refresh(isShift);
            }
        },
        refresh: function (isShift) {
            if (!isShift) return;

            var model = controller.getModel();
            controller.view.style.left = model.left + 'px';
            controller.view.style.top = model.top + 'px';
            controller.view.style.width = model.width + 'px';
            controller.view.style.height = model.height + 'px';
        },
        finish: function () {
            if( !controller.view ) return;
            
            controller.view = null;
            controller.toggleSelection(false);
            document.body.removeChild(document.getElementById('current-selection'));
            chrome.runtime.sendMessage({command: 'update', model: controller.getModel()});
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
        controller.update(e.shiftKey, e.pageX, e.pageY)
    };

    document.body.onmouseup = function (e) {
        controller.finish();
    };

    document.body.onkeyup = function (e) {
        controller.toggleSelection(e.shiftKey);
    };

}


function render(model) {
    var oldRects = document.querySelectorAll('.rectangle');
    if (oldRects) {
        for (var k = 0; k < oldRects.length; k++) {
            document.body.removeChild(oldRects[k]);
        }
    }
    for (var i = 0; i < model.length; i++) {
        var restoredRect = document.createElement('div');
        restoredRect.className = 'rectangle';
        restoredRect.style.left = model[i].left + 'px';
        restoredRect.style.top = model[i].top + 'px';
        restoredRect.style.width = model[i].width + 'px';
        restoredRect.style.height = model[i].height + 'px';
        document.body.appendChild(restoredRect);
    }
}


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command === 'render') {
        render(msg.model);
    }
});

init();
