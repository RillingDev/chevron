"use strict";
import {
    rollup
} from "rollup";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

export default {
    moduleName: "Chevron",
    moduleId: "chevron",
    entry: "src/main.js",
    plugins: [
        nodeResolve({
            jsnext: false,
            main: true
        }),
        commonjs({})
    ],
    targets: [{
        dest: "dist/es6/chevron.amd.js",
        format: "amd"
    }, {
        dest: "dist/es6/chevron.common.js",
        format: "cjs"
    }, {
        dest: "dist/es6/chevron.es.js",
        format: "es"
    }, {
        dest: "dist/es6/chevron.js",
        format: "iife"
    }]
};
