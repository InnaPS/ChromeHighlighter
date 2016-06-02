

     function init() {
        var port = chrome.runtime.connect({name: "knockknock"});
        port.onMessage.addListener(function(msg) {

        });



        var rect = null,
        mouse = {
            startX: 0,
            startY: 0,
            x: 0,
            y: 0
        }

        function setMousePosition(e) {
            mouse.x = e.pageX;
            mouse.y = e.pageY;
        }

        function onMouseMove () {
            if (rect !== null) {
                rect.model.x = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
                rect.model.y = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
                rect.model.width = Math.abs(mouse.x - mouse.startX) + 'px';
                rect.model.height = Math.abs(mouse.y - mouse.startY) + 'px';
            }
        }

       
        function onMouseDown () {
            console.log("begun.");
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
            rect = {
                name: 'update',
                model: {}
            };
        }

        function onMouseUp () {
            if (rect !== null) {
                if (rect.model.width != "" && rect.model.width != "0px" && rect.model.width != undefined) {
                    if (rect.model.height != "" && rect.model.height != "0px" && rect.model.height != undefined) {
                        port.postMessage({create: rect});
                    }
                }
                rect = null;
                console.log("finished.");
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





