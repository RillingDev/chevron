"use strict";

const gulp = require("gulp");
const jasmine = require("gulp-jasmine");

module.exports = function() {
    return gulp.src("spec/*.spec.js")
        .pipe(jasmine());
};
