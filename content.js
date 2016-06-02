$(document).ready(function(){

    //method for comparing arrays - to delete and replace with lodash lib
    if(Array.prototype.equalS)
        console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
    // attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equalS = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equalS(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };
    // Hide method from for-in loops
    Object.defineProperty(Array.prototype, "equalS", {enumerable: false});



    function init() {
        var port = chrome.runtime.connect({name: "knockknock"});
        port.postMessage({joke: "Knock knock"});
        port.onMessage.addListener(function(msg) {
            if (msg.question == "Who's there?")
                console.log(msg.question);
            //if (msg.modelToRender)
                //console.log(msg.modelToRender);
                //render(msg.modelToRender);
            if (msg.checking == 'one two')
                console.log('OK');
        });



        var rect = null,
        mouse = {
            startX: 0,
            startY: 0,
            x: 0,
            y: 0
        },
        url = document.location.href; //???

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

        /*function onKeyDown () {

        }*/

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
                        port.postMessage({newRect: rect});
                    }
                }
                rect = null;
                console.log("finished.");
            }
        }

        /*function onKeyUp () {
            document.body.className = '';
        }*/



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




}); // the end

