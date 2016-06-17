"use strict";

let cv = new Chevron("demoChevron");

cv
    .service("addTwo", [], function(number) {
        return parseInt(number) + 2;
    })

.service("addTen", [], function(number) {
    return parseInt(number) + 10;
})

.service("addTwelve", ["addTwo", "addTen"], function(number) {
    return this.addTen(this.addTwo(number));
})

.factory("miscNumbers", [], function() {
    this.foo = 23;
    this.bar = 19;
}, [])

.factory("miscNumbersPlusTwelve", ["addTwelve", "miscNumbers"], function() {
    this.foo = this.addTwelve(this.miscNumbers.foo);
    this.bar = this.addTwelve(this.miscNumbers.bar);
    console.log(this);
}, [])

.service("sumOfMiscNumbemiscNumbersPlusTwelversPlusTwelve", ["miscNumbersPlusTwelve"], function() {
    return this.miscNumbersPlusTwelve.foo + this.miscNumbersPlusTwelve.bar;
})

.middleware(function(service) {
    console.log("added two!");
}, ["addTwo"]);

let accessedFn = cv.access("sumOfMiscNumbemiscNumbersPlusTwelversPlusTwelve");
console.log(accessedFn());
