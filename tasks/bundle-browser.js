"use strict";

const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const header = require("gulp-header");
const rollup = require("rollup-stream");
const babel = require("rollup-plugin-babel");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const createHeader = require("./header");
const packageJson = require("../package.json");

module.exports = function() {
    return rollup({
            entry: "./src/main.js",
            format: "iife",
            plugins: [babel()],
            moduleName: packageJson.namespace.module
        })
        .pipe(source(`${packageJson.namespace.file}.js`))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(header(createHeader(packageJson)))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist"));
};
