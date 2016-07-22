"use strict";

export default {
    moduleName: "Chevron",
    moduleId: "chevron",
    entry: "src/main.js",
    plugins: [],
    targets: [{
        dest: "dist/chevron.amd.js",
        format: "amd"
    }, {
        dest: "dist/chevron.common.js",
        format: "cjs"
    }, {
        dest: "dist/chevron.umd.js",
        format: "umd"
    }, {
        dest: "dist/chevron.es.js",
        format: "es"
    }, {
        dest: "dist/chevron.js",
        format: "iife"
    }]
};
