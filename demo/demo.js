"use strict";

let cv = new Chevron();

cv.service("myService1", [], function () {
    console.log("myService1 initialized");
});

cv.service("myService2", ["myService1"], function (args) {
    console.log("myService2 initialized");
    console.log(this.myService1);
    console.log(args);
});

cv.service("myService3", ["myService1", "myService2"], "lorem ipsum");

console.log(cv);
