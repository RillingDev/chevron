"use strict";

let cv = new Chevron();

cv.service("myService1", [], function () {
    console.log("myService1 initialized");
    return 12
});

cv.service("myService2", ["myService1"], function (foo) {
    cv.access("myService1")();
    console.log("myService2 initialized");
    console.log(this.myService1);
    console.log(foo);
});

cv.service("myService3", ["myService1", "myService2"], function (foo, bar) {
    cv.access("myService2")(foo);
    console.log("myService3 initialized");
    console.log(foo * bar);
    return foo * bar
});

cv.factory("myFactory1", ["myService1"], function (foo, bar) {
    this.fac3 = cv.access("myService1")(bar);
    this.val = foo;
    this.val2 = bar;
    console.log(arguments);
}, ["foo", "bar"]);

console.log(cv);
