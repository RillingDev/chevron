"use strict";

let cv = new Chevron("demoChevron");

cv.

service("addTwo", [], function (number) {
    return parseInt(number) + 2;
})

.service("addTen", [], function (number) {
    return parseInt(number) + 10;
})

.service("addTwelve", ["addTwo", "addTen"], function (addTwo, addTen, number) {
    return addTen(addTwo(number));
})

.service("sumOf", [], function (number1, number2) {
    return number1 + number2;
})

.factory("miscNumbers", [], function () {
    this.foo = 23;
    this.bar = 19;
}, [])

.factory("miscNumbersPlusTwelve", ["addTwelve", "miscNumbers"], function (addTwelve, miscNumbers) {
    this.foo = addTwelve(miscNumbers.foo);
    this.bar = addTwelve(miscNumbers.bar);
    console.log(this);
}, [])

.service("sumOfMiscNumbemiscNumbersPlusTwelve", ["miscNumbersPlusTwelve", "sumOf"], function (miscNumbersPlusTwelve, sumOf) {
    return sumOf(miscNumbersPlusTwelve.foo, miscNumbersPlusTwelve.bar);
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

let sumOfMiscNumbemiscNumbersPlusTwelve = cv.access("sumOfMiscNumbemiscNumbersPlusTwelve");
console.log(sumOfMiscNumbemiscNumbersPlusTwelve());
