"use strict";

let cv = new Chevron();

cv.service("myService1", [], function () {
    console.log("myService1 initialized");
});

cv.service("myService2", ["myService1"], function (foo) {
    cv.access("myService1")();
    console.log("myService2 initialized");
    console.log(this.myService1);
    console.log(foo);
});

cv.service("myService3", ["myService1", "myService2"], function (foo, bar) {
    cv.access("myService2")("lorem ipsum");
    console.log("myService3 initialized");
    console.log(foo);
    console.log(bar);
});

console.log(cv);
