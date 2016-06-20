function fun(){
}
fun.prototype.firstname = 'yogesh';
fun.prototype.lastname = 'jagdale';

function f() {
}
f.prototype = new fun();
f.prototype.last = 'fdfdg';
f.prototype.lastname = 'aaa';

var obj = new f();

for(var proto in obj.constructor.prototype){
    console.log(proto);
}
