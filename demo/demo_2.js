"use strict";

let cv = new Chevron("demoChevron");

cv
    .service("myService1", [], function() {
        console.log("myService1 started");
        return 4;
    })

.service("myService2", ["myService1", "myFactory1"], function(foo) {
    console.log("myService2 started");
    return foo + " + " + this.myFactory1.bar + " + " + this.myService1();
})

.service("myService3", ["myService1", "myService2", "myFactory1", "myFactory2"], function(foo) {
    console.log("myService3 started");
    return this.myService1() + " " + this.myService2(foo) + " " + this.myFactory1.foo + "" + this.myFactory2.value;
})

.factory("myFactory1", ["myService1"], function(foo, bar) {
    console.log("myFactory1 started");
    this.foo = foo + " + " + this.myService1();
    this.bar = bar + " lorem";
    //this.foobar = foo + bar + cv.access("myService1")();
}, [12, 24])

.factory("myFactory2", ["myService1", "myService2", "myFactory1"], function(bar) {
    console.log("myFactory2 started");
    this.lol = arguments;
    this.value = bar + this.myService2(bar);
    //this.foobar = foo + bar + cv.access("myService1")();
}, [33])

.middleware(function(name) {
    console.log("Middleware fired for " + name);
})

.middleware(function(name) {
    console.log("the primary service " + name + " was called!");
}, ["myService1"]);


/*let accessedFac = cv.access("myFactory2");
console.log(accessedFac);
console.log("##########");*/
let accessedFn = cv.access("myService3");
console.log(accessedFn(21));
