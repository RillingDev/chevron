//Uglifyies with variables filename
"use strict";

const fs = require("fs");
const uglifyJS = require("uglify-js");
const packageJson = require("../package.json");

const result = uglifyJS.minify([`./dist/${packageJson.module.id}.js`], {
    compress: {
        dead_code: true,
        properties: true,
        unsafe: true,
        unsafe_comps: true,
        conditionals: true,
        comparisons: true,
        booleans: true,
        loops: true,
        if_return: true,
        join_vars: true,
        passes: 3
    }
});

fs.writeFile(`./dist/${packageJson.module.id}.min.js`, result.code, function(err) {
    if (err) {
        throw err;
    }
});
