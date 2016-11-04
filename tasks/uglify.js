"use strict";

const gulp = require("gulp");
const pump = require("pump");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const packageJson = require("../package.json");

module.exports = function(cb) {
    const commands = [
        gulp.src(`./dist/${packageJson.namespace.file}.js`),
        sourcemaps.init(),
        uglify(),
        rename({
            suffix: ".min",
        }),
        sourcemaps.write("."),
        gulp.dest("./dist/")
    ];

    pump(commands, cb);
};
