"use strict";
var initialize_1 = require("./initialize");
var recurseDependencies_1 = require("./recurseDependencies");
/**
 * Inits module and all dependencies
 * @private
 * @param {Object} chev The chevron container
 * @param {Object} module The module to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized module
 */
function default_1(chev, module, cf) {
    var list = {};
    //Recurse trough module deps
    recurseDependencies_1["default"](chev, module, 
    //run this over every dependency to add it to the dependencyList
    function (dependency) {
        //make sure if dependency is initialized, then add
        list[dependency.name] = dependency.init();
    });
    return initialize_1["default"](module, list, cf);
}
exports.__esModule = true;
exports["default"] = default_1;
