"use strict";

export default {
    moduleName: "Chevron",
    entry: "src/main.js",
    plugins: [],
    targets: [{
        dest: "dist/chevron.cjs.js",
        format: "cjs"
    }, {
        dest: "dist/chevron.umd.js",
        format: "amd"
    }, {
        dest: "dist/chevron.es.js",
        format: "es"
    }, {
        dest: "dist/chevron.js",
        format: "iife"
    }, ]
};
