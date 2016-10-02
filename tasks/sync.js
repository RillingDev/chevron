//Syncs package.json with bower.json
"use strict";

const fs = require("fs");
const packageJson = require("../package.json");
const bowerJson = require("../bower.json");
const newBowerJson = bowerJson;

newBowerJson.name = packageJson.name;
newBowerJson.version = packageJson.version;
newBowerJson.description = packageJson.description;
newBowerJson.repository = packageJson.repository;
newBowerJson.keywords = packageJson.keywords;
newBowerJson.author = packageJson.author;
newBowerJson.license = packageJson.author;
newBowerJson.bugs = packageJson.author;
newBowerJson.homepage = packageJson.homepage;

fs.writeFile("./bower.json", JSON.stringify(newBowerJson, null, "    "), function(err) {
    if (err) {
        throw err;
    }
});
