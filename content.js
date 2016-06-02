
     function init() {
        var port = chrome.runtime.connect({name: "knockknock"});
        port.onMessage.addListener(function(msg) {

        });

        var viewRect = {
            rect: null,
            x: 0,
            y: 0
        },
        rect = null;

        function setMousePosition(e) {
            viewRect.x = e.pageX;
            viewRect.y = e.pageY;
        }

        function onMouseMove () {
            if (viewRect.rect !== null) {
                rect.style.left = viewRect.rect.model.x = (viewRect.x - viewRect.startX < 0) ? viewRect.x + 'px' : viewRect.startX + 'px';
                rect.style.top = viewRect.rect.model.y = (viewRect.y - viewRect.startY < 0) ? viewRect.y + 'px' : viewRect.startY + 'px';
                rect.style.width = viewRect.rect.model.width = Math.abs(viewRect.x - viewRect.startX) + 'px';
                rect.style.height = viewRect.rect.model.height = Math.abs(viewRect.y - viewRect.startY) + 'px';
            }
        }

       
        function onMouseDown () {
            viewRect.startX = viewRect.x;
            viewRect.startY = viewRect.y;
            viewRect.rect = {
                name: 'update',
                model: {}
            };
            rect = document.createElement('div');
            rect.className = 'viewRect';
            rect.style.left = viewRect.x + 'px';
            rect.style.top = viewRect.y + 'px';
            document.body.appendChild(rect);
        }

        function onMouseUp () {
            if (viewRect.rect !== null) {
                if (viewRect.rect.model.width != "" && viewRect.rect.model.width != "0px" && viewRect.rect.model.width != undefined) {
                    if (viewRect.rect.model.height != "" && viewRect.rect.model.height != "0px" && viewRect.rect.model.height != undefined) {
                        port.postMessage({create: rect});
                    }
                }
                viewRect.rect = null;
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




    }

    function render() {

    }


    init();




