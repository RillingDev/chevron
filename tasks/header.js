//Write head to js
"use strict";

const fs = require("fs");
const packageJson = require("../package.json");
const id = packageJson.module.id;
const base = "./dist/";
const files = [
    `es6/${id}.amd.js`,
    `es6/${id}.common.js`,
    `es6/${id}.es.js`,
    `es6/${id}.js`,
    `${id}.amd.js`,
    `${id}.common.js`,
    `${id}.es.js`,
    `${id}.js`
];
const head =
    `/**
 * ${packageJson.module.name} ${packageJson.version}
 * Author: ${packageJson.author}
 * Homepage: ${packageJson.homepage}
 * License: ${packageJson.license}
 */

`;

function writeHeader(file) {
    const path = base + file;

    fs.readFile(path, function read(err, data) {
        if (err) {
            throw err;
        }
        fs.writeFile(path, head + data, function(err) {
            if (err) {
                throw err;
            }
            console.log(`wrote ${path}`);
        });
    });
}

files.forEach(file => {
    writeHeader(file);
});
