"use strict";

cv.service("spaceReverse", ["spaceAround", "reverseString"], function (spaceAround, reverseString, str, int) {
    console.log(str);
    return spaceAround(reverseString(str), int)
});

cv.service("spaceAround", ["leftPad", "rightPad"], function (leftPad, rightPad, str, int) {
    return rightPad(leftPad(str, int), int);
});

cv.service("reverseString", [], function (str) {
    return str.split("").reverse().join("");
});
