"use strict";

const gulp = require("gulp");
const pump = require("pump");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const uglifyjs = require("uglify-js");
const minifier = require("gulp-uglify/minifier");
const packageJson = require("../package.json");

module.exports = function (cb) {
    const commands = [
        gulp.src(`./dist/${packageJson.namespace.file}.js`),
        sourcemaps.init(),
        minifier({}, uglifyjs),
        rename({
            suffix: ".min",
        }),
        sourcemaps.write("."),
        gulp.dest("./dist/")
    ];

    pump(commands, cb);
};
