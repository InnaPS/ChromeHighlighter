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
            controller.view.className = 'rectangle';
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
                width: Math.abs(controller.end.x - controller.start.x),
                height: Math.abs(controller.end.y - controller.start.y)
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

        var buttonDelete = document.createElement('div');
        buttonDelete.className = 'button';
        buttonDelete.style.top = '5px';
        buttonDelete.style.left = model[i].width - 5 - 16 + 'px';
        restoredRect.appendChild(buttonDelete);

        var buttonMove = document.createElement('div');
        buttonMove.className = 'button';
        buttonMove.style.top = model[i].height - 5 - 16 + 'px';
        buttonMove.style.left = model[i].width - 5 - 16 + 'px';
        restoredRect.appendChild(buttonMove);
    }

    var newRects = document.querySelectorAll('.rectangle');
    for (var j = 0; j < newRects.length; j++) {
        newRects[j].onmouseenter = function() {
            //this.style.backgroundColor = 'blue';
            var buttons = this.children;
            for (var k = 0; k < buttons.length; k++) {
                buttons[k].style.display = "block";
            }
        };
        newRects[j].onmouseleave = function() {
            var buttons = this.children;
            for (var k = 0; k < buttons.length; k++) {
                buttons[k].style.display = "";
            }
        };
    }
}


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command === 'render') {
        render(msg.model);
    }
});

init();
