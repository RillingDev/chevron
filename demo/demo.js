"use strict";

(function (Chevron) {
    let cv = new Chevron();

    cv.service("myService", [], function () {
        console.log(this);
    })

    console.log(cv);
})(Chevron);
