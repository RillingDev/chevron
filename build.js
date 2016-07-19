"use strict";

var fs = require("fs");
//var zlib = require("zlib");
var rollup = require("rollup");
var uglify = require("rollup-plugin-uglify");
var uglifyJs = require("uglify-js");
var babel = require("rollup-plugin-babel");
var version = "3.0.0";

let banner = `/*
Chevron v${version}

Copyright (c) 2016 Felix Rilling

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
`;
console.log(uglifyJs.minify);
rollup.rollup({
        entry: "src/main.js",
        plugins: [
            //uglify({}, uglifyJs.minify)
        ]
    })
    .then(function (bundle) {
        return write("dist/chevron.js", uglifyJs.minify(bundle.generate({
            format: "amd",
            banner: banner
        }).code));
    });

function write(dest, code) {
    console.log(dest);
    return new Promise(function (resolve, reject) {
        fs.writeFile(dest, code, function (err) {
            if (err) return reject(err);
            console.log(dest + " " + getSize(code));
            resolve();
        });
    });
}

/*function zip() {
    return new Promise(function (resolve, reject) {
        fs.readFile("dist/vue.min.js", function (err, buf) {
            if (err) return reject(err)
            zlib.gzip(buf, function (err, buf) {
                if (err) return reject(err)
                write("dist/vue.min.js.gz", buf).then(resolve)
            });
        });
    })
}*/

function getSize(code) {
    return (code.length / 1024).toFixed(2) + "kb";
}

function logError(e) {
    console.log(e);
}
