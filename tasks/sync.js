//Syncs package.json with bower.json
"use strict";

const fs = require("fs");
const packageJson = require("../package.json");
const bowerJson = require("../bower.json");

const keysToSync = ["name", "version", "description", "repository", "keywords", "author", "license", "bugs", "homepage"];


keysToSync.forEach(key => {
    bowerJson[key] = packageJson[key];
});


fs.writeFile("./bower.json", JSON.stringify(bowerJson, null, "    "), function(err) {
    if (err) {
        throw err;
    }
});
