"use strict";

cv.factory("processedStrings", ["spaceAround", "spaceReverse"], function (spaceAround, spaceReverse) {
    console.log(arguments);
    this.foo = spaceAround("foo", 3);
    this.oof = spaceReverse("foo", 3);
}, []);
