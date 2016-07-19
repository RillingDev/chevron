"use strict";

let cv = new Chevron();

cv.service("myService1", [], function () {
    console.log("myService1 started");
    return 4;
});

cv.service("myService2", ["myService1", "myFactory1"], function (myService1, myFactory1, foo) {
    console.log("myService2 started");
    console.log(arguments);
    return foo + " + " + myFactory1.bar + " + " + myService1();
});

cv.factory("myFactory1", ["myService1"], function (myService1, foo, bar) {
    console.log("myFactory1 started");
    console.log(arguments);
    //this.foo = foo + " + " + myService1();
    this.bar = bar + " lorem";
    //this.foobar = foo + bar + myService1();
}, [12, 24]);

let myService2 = cv.access("myService2");
console.log(myService2(21));
