"use strict";
import {
    rollup
} from "rollup";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

let pkg = require("./package.json");
let external = Object.keys(pkg.dependencies);

export default {
    moduleName: "Chevron",
    moduleId: "chevron",
    entry: "src/main.js",
    external: external,
    plugins: [
        nodeResolve({
            jsnext: false,
            main: true
        }),
        commonjs({})
    ],
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
