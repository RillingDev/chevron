"use strict";

cv.service("leftPad", [], function (str, int) {
    return str + " ".repeat(int);
});

cv.service("rightPad", [], function (str, int) {
    return " ".repeat(int) + str;
});
