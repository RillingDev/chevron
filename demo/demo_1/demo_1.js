"use strict";

//https://github.com/FelixRilling/chevronjs
//Create new Chevron Instance
let cv = new Chevron("demoChevron");

/**
 * Components can be arranged in any order you like
 */
cv.service("writeHelloWorld", ["writeln", "strings"], function(writeLn, strings) {
    const helloWorld = "<h1>" + strings.foo + " " + strings.bar + "<h1>";
    writeLn(helloWorld);
});

cv.factory("strings", [], function() {
    this.foo = "Hello";
    this.bar = "World";
});

cv.service("writeln", ["ifCanWrite", "constants"], function(ifCanWrite, constants, str) {
    ifCanWrite(function() {
        constants.doc.writeln(str);
    });
});

cv.factory("constants", [], function() {
    this.doc = window.document;
});

cv.service("ifCanWrite", ["constants"], function(constants, fn) {
    if (typeof constants.doc.writeln !== "undefined") {
        fn();
    }
});

let writeHelloWorld = cv.access("writeHelloWorld");
writeHelloWorld();
