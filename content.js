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
        buttonDelete.className = 'buttonDelete';
        buttonDelete.style.top = '5px';
        buttonDelete.style.left = model[i].width - 5 - 16 + 'px';
        buttonDelete.i = i;
        //var link = chrome.extension.getURL('logo.png');
        //buttonDelete.style.backgroundImage = "('" + link + "')";
        restoredRect.appendChild(buttonDelete);

        var buttonMove = document.createElement('div');
        buttonMove.className = 'buttonMove';
        buttonMove.style.top = '5px';
        buttonMove.style.left = model[i].width - 2*5 - 2*16 + 'px';
        buttonMove.i = i;
        restoredRect.appendChild(buttonMove);

        buttonDelete.onclick = function() {
            document.body.removeChild(this.parentElement);
            model.splice(this.i, 1);
            chrome.runtime.sendMessage({command: 'updateModel', model: model});

        };
        buttonMove.onclick = function() {
            var recttoMove = this.parentElement;
            recttoMove.onmousedown = function(e) {
                var coords = getCoords(recttoMove);

                function getCoords(elem) {
                    var box = elem.getBoundingClientRect();
                    return {
                        top: box.top + pageYOffset,
                        left: box.left + pageXOffset
                    };
                }
                var shiftX = e.pageX - coords.left;
                var shiftY = e.pageY - coords.top;

                moveAt(e);

                function moveAt(e) {
                    recttoMove.style.left = e.pageX - shiftX + 'px';
                    recttoMove.style.top = e.pageY - shiftY + 'px';
                }

                document.onmousemove = function(e) {
                    moveAt(e);
                };

                recttoMove.onmouseup = function() {
                    document.onmousemove = null;
                    recttoMove.onmouseup = null;
                };

            };

            recttoMove.ondragstart = function() {
                return false;
            };
        };
    }

    var newRects = document.querySelectorAll('.rectangle');
    for (var j = 0; j < newRects.length; j++) {
        newRects[j].onmouseenter = function() {
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
