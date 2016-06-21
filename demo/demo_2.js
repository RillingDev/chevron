"use strict";

let cv = new Chevron("demoChevron");

cv
    .service("addTwo", [], function (number) {
        return parseInt(number) + 2;
    })

.service("addTen", [], function (number) {
    return parseInt(number) + 10;
})

.service("addTwelve", ["addTwo", "addTen"], function (number) {
    return this.addTen(this.addTwo(number));
})

.service("sumOf", [], function (number1, number2) {
    return number1 + number2;
})

.factory("miscNumbers", [], function () {
    this.foo = 23;
    this.bar = 19;
}, [])

.factory("miscNumbersPlusTwelve", ["addTwelve", "miscNumbers"], function () {
    this.foo = this.addTwelve(this.miscNumbers.foo);
    this.bar = this.addTwelve(this.miscNumbers.bar);
    console.log(this);
}, [])

.service("sumOfMiscNumbemiscNumbersPlusTwelve", ["miscNumbersPlusTwelve", "sumOf"], function () {
    return this.sumOf(this.miscNumbersPlusTwelve.foo, this.miscNumbersPlusTwelve.bar);
})

.middleware(function (service) {
    console.log("added two!");
}, ["addTwo"])

.middleware(function (service) {
    console.log("added ...twelve?");
}, ["addTwelve"])

.decorator(function (service) {
    console.log("decorated addTwelve");
    return service;
}, ["addTwelve"])

.decorator(function (service) {
    service = function () {
        console.log("decorated miscNumbers!");
        this.foo = 10;
        this.bar = 4;
    };
    return service;
}, ["miscNumbers"]);

let accessedFn = cv.access("sumOfMiscNumbemiscNumbersPlusTwelve");
console.log(accessedFn());
