"use strict";

const gulp = require("gulp");
const header = require("gulp-header");
const rollup = require("rollup-stream");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const createHeader = require("./header");
const packageJson = require("../package.json");

module.exports = function() {
    return rollup({
            entry: "./src/main.js",
            format: "cjs"
        })
        .pipe(source(`${packageJson.namespace.file}.common.js`))
		.pipe(buffer())
		.pipe(header(createHeader(packageJson)))
        .pipe(gulp.dest("./dist"));
};
