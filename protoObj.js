var Animal = function() { };
Animal.prototype.size = 'small';

var Mammal = function() { };
Mammal.prototype = new Animal();
Mammal.prototype.name = 'rabbit';

var Rabbit = function(nickname) {
    this.nickname = nickname;
};
Rabbit.prototype = new Mammal();

var myRabbit = new Rabbit('Cutie');

var objString = '';
function getObj(obj){
    if (obj.prototype !== Object) {
        var ownKeys = Object.keys(obj);
        var protoKeys = [];
        for (var key in obj) {
            console.log(key);
                if (!(obj.hasOwnProperty(key))) {
                    protoKeys.push(key);
                }
        }
        console.log(protoKeys);
        var proto = Object.getPrototypeOf(obj);

        /*for (var i = 0; i < ownKeys.length; i++) {
            objString += ownKeys[i] + ' ';
            for (var j = 0; j < protoKeys.length; j++) {
                if (ownKeys[i] === protoKeys[j]) {
                    protoKeys[j] = 'parent' + protoKeys[j];
                } else {
                    objString += protoKeys[j] + ' ';
                }
            }
        }*/
    }
    return objString;
}

console.log(getObj(myRabbit));