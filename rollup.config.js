"use strict";

import {
    rollup
} from "rollup";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

const packageJson = require("./package.json");

export default {
    moduleName: packageJson.module.name,
    moduleId: packageJson.module.id,
    entry: "src/main.js",
    plugins: [
        nodeResolve({
            jsnext: false,
            main: true
        }),
        commonjs({})
    ],
    targets: [{
        dest: `dist/es6/${packageJson.module.id}.amd.js`,
        format: "amd"
    }, {
        dest: `dist/es6/${packageJson.module.id}.common.js`,
        format: "cjs"
    }, {
        dest: `dist/es6/${packageJson.module.id}.es.js`,
        format: "es"
    }, {
        dest: `dist/es6/${packageJson.module.id}.js`,
        format: "iife"
    }]
};
