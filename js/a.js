/**
 * Created by luozheao on 2017/6/19.
 */
define([],function () {
    var A={
        say:function (str) {
            console.log(str||'A');
        }
    }
    A.say();
    return A;
});