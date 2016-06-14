"use strict";

let cv = new Chevron("demoChevron");

cv.service("myService1", [], function() {
    console.log("myService1 initialized");
    return 4;
});

cv.service("myService2", ["myService1"], function(foo) {
    console.log("myService2 initialized");
    return foo + cv.access("myService1")();
});
/*
cv.service("myService3", ["myService1", "myService2", "myFactory1"], function(foo, bar) {
    console.log("myService3 initialized");
    return this.myFactory1.foobar + " " + this.myService2(foo) + "" + bar;
});



cv.factory("myFactory1", ["myService1"], function(foo, bar) {
    console.log("myFactory1 initialized");
    this.foo = foo + " ipsum";
    this.bar = bar + " lorem";
    this.foobar = foo + bar + cv.access("myService1")();
}, [12, 24]);


cv.middleware((sv, name) => {
    console.log("middleware fired for " + name);
});
*/
/*cv.decorator((sv, name) => {
    console.log("decorator fired for " + name);
}, ["myService3"]);*/

let accessedFn = cv.access("myService2");
console.log(accessedFn(10, 12));
