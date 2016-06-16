
var Animal = function() {
};
Animal.prototype.size = 'small';

var Mammal = function() {
};
Mammal.prototype = new Animal();
Mammal.prototype.name = 'rabbit';

var Rabbit = function() {
};
Rabbit.prototype = new Mammal();
Rabbit.nickname = 'Cutie';

var myRabbit = new Rabbit();

var objString = '';
function getObj(obj){
    if (obj.prototype !== Object) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var ownKeys = [];
                ownKeys.push({key: key, p: obj[key]});
            }
            if (key in Object.getPrototypeOf(obj)) {
                var protoKeys = [];
                protoKeys.push({key: key, p: obj[key]});
            }
        }
        /*for (var i = 0; i < ownKeys.length; i++) {
            for (var j = 0; j < protoKeys.length; j++) {
                if (ownKeys[i].key = protoKeys[j].key) {
                    protoKeys[j].key = 'parent' + protoKeys[j].key;
                }
                objString += ownKeys[i].key + ' ' + ownKeys[i].p + ' ' + protoKeys[j].key + ' ' + protoKeys[j].p + ' ';
            }
        }*/

    }
    return objString;
}

console.log(getObj(myRabbit));

