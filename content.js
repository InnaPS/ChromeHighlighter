
     function init() {

        var rect = {
            rect: null,
            x: 0,
            y: 0
        },
        viewRect = null;

        function setMousePosition(e) {
            rect.x = e.pageX;
            rect.y = e.pageY;
        }

        function onMouseMove () {
            if (rect.rect !== null) {
                viewRect.style.left = rect.rect.model.x = (rect.x - rect.startX < 0) ? rect.x + 'px' : rect.startX + 'px';
                viewRect.style.top = rect.rect.model.y = (rect.y - rect.startY < 0) ? rect.y + 'px' : rect.startY + 'px';
                viewRect.style.width = rect.rect.model.width = Math.abs(rect.x - rect.startX) + 'px';
                viewRect.style.height = rect.rect.model.height = Math.abs(rect.y - rect.startY) + 'px';
            }
        }

        function onMouseDown () {
            rect.startX = rect.x;
            rect.startY = rect.y;
            rect.rect = {
                name: 'update',
                model: {}
            };
            viewRect = document.createElement('div');
            viewRect.className = 'viewRect';
            viewRect.style.left = rect.x + 'px';
            viewRect.style.top = rect.y + 'px';
            document.body.appendChild(viewRect);
        }

        function onMouseUp () {
            if (!_.isEmpty(rect.rect)) {
                if (rect.rect.model.width != "" && rect.rect.model.width != "0px" && rect.rect.model.width != undefined) {
                    if (rect.rect.model.height != "" && rect.rect.model.height != "0px" && rect.rect.model.height != undefined) {
                        chrome.runtime.sendMessage({type: rect.rect}, function(response) {});
                    }
                }
                rect.rect = null;
                var rectsToDelete = document.querySelectorAll('.viewRect');
                for (var m = 0; m < rectsToDelete.length; m++) {
                    document.body.removeChild(rectsToDelete[m]);
                }
            }
        }

        document.body.onmousemove = function (e) {
            setMousePosition(e);
            onMouseMove();
        };

        document.body.onkeydown = function (e) {
            if (e.shiftKey) {
                document.body.className = 'non-selectable';
            }
        };

        document.body.onmousedown = function(e) {
            if (e.shiftKey) {
                onMouseDown ();
            }
        };

        document.body.onmouseup = function (e) {
            if (e.shiftKey) {
                onMouseUp ();
            }
        };

        document.body.onkeyup = function (e) {
            if (!e.shiftKey) {
                document.body.className = '';
            }
        };

         chrome.runtime.onMessage.addListener(
             function(request, sender, sendResponse) {
                 if(request.model)
                     render(request.model);
                 return true;
         });

    }

    function render(model) {
        var oldRects = document.querySelectorAll('.rectangle');
        if (oldRects) {
            for (var k = 0; k < oldRects.length; k++) {
                document.body.removeChild(oldRects[k]);
            }
        }
        for (var i = 0; i < model.model.length; i++) {
            var restoredRect = document.createElement('div');
            restoredRect.className = 'rectangle';
            restoredRect.style.left = model.model[i].x;
            restoredRect.style.top = model.model[i].y;
            restoredRect.style.width = model.model[i].width;
            restoredRect.style.height = model.model[i].height;
            document.body.appendChild(restoredRect);
        }

    }


    init();
