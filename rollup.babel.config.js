"use strict";

import {
    rollup
} from "rollup";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

const lib = require("./package.json").module;
const base = "./dist";

export default {
    moduleName: lib.name,
    moduleId: lib.id,
    entry: "src/main.js",
    plugins: [
        nodeResolve({
            jsnext: false,
            main: true
        }),
        commonjs({}),
        babel({
            exclude: "node_modules/**"
        })
    ],
    targets: [{
        dest: `${base}/${lib.id}.amd.js`,
        format: "amd"
    }, {
        dest: `${base}/${lib.id}.common.js`,
        format: "cjs"
    }, {
        dest: `${base}/${lib.id}.es.js`,
        format: "es"
    }, {
        dest: `${base}/${lib.id}.js`,
        format: "iife"
    }]
};
