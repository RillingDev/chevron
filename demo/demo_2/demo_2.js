"use strict";

let cv = new Chevron();

cv.

factory("miscNumbersPlusTwelve", ["addTwelve", "miscNumbers"], function (addTwelve, miscNumbers) {
    this.foo = addTwelve(miscNumbers.foo);
    this.bar = addTwelve(miscNumbers.bar);
    console.log(this);
}, [])

.service("addTwo", [], function (number) {
    return parseInt(number) + 2;
})

.service("addTen", [], function (number) {
    return parseInt(number) + 10;
})

.factory("miscNumbers", [], function () {
    this.foo = 23;
    this.bar = 19;
}, [])

.service("addTwelve", ["addTwo", "addTen"], function (addTwo, addTen, number) {
    return addTen(addTwo(number));
})

.service("sumOf", [], function (number1, number2) {
    return number1 + number2;
})

.service("sumOfMiscNumbemiscNumbersPlusTwelve", ["miscNumbersPlusTwelve", "sumOf"], function (miscNumbersPlusTwelve, sumOf) {
    return sumOf(miscNumbersPlusTwelve.foo, miscNumbersPlusTwelve.bar);
});

let sumOfMiscNumbemiscNumbersPlusTwelve = cv.access("sumOfMiscNumbemiscNumbersPlusTwelve");
console.log(sumOfMiscNumbemiscNumbersPlusTwelve());
