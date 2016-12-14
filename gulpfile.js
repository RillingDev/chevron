"use strict";

const gulp = require("gulp");
const gulpSequence = require("gulp-sequence");

const task_bundle_browser = require("./tasks/bundle-browser");
const task_bundle_common = require("./tasks/bundle-common");
const task_bundle_es = require("./tasks/bundle-es");
const task_uglify = require("./tasks/uglify");
const task_clean = require("./tasks/clean");
const task_test = require("./tasks/test");

gulp.task("bundle-browser", [], task_bundle_browser);
gulp.task("bundle-common", [], task_bundle_common);
gulp.task("bundle-es", [], task_bundle_es);
gulp.task("uglify", [], task_uglify);
gulp.task("clean", [], task_clean);
gulp.task("test", [], task_test);

gulp.task("bundle", ["bundle-browser", "bundle-common", "bundle-es"]);
gulp.task("build", function(cb) {
    gulpSequence("clean", "bundle", "uglify", cb);
});
gulp.task("dist", function(cb) {
    gulpSequence("build", "test", cb);
});
gulp.task("watch", function() {
    gulp.watch("./src/**/*.js", ["bundle"]);
});
gulp.task("default", ["dist"]);
