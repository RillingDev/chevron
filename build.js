"use strict";

var rollup = require("rollup");
var uglify = require("rollup-plugin-uglify");
var uglifyJs = require("uglify-js");

rollup.rollup({
    entry: "main.js",
    plugins: [
        uglify({}, uglifyJs.minify)
    ]
});
