"use strict";

(function (Chevron) {
    let cv = new Chevron();

    cv.service("myService1", [], function () {
        console.log("myService1 initialized");
    });

    cv.service("myService2", ["myService1"], function (myService1) {
        console.log("myService2 initialized");
        console.log(myService1);
    });

    cv.service("myService3", ["myService1","myService2"], "lorem ipsum");

    console.log(cv);
})(Chevron);
