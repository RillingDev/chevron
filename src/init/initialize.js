"use strict";

import constructModule from "./constructModule";
import recurseDependencies from "./recurseDependencies";

/**
 * Inits module and all dependencies
 * @private
 * @param {Object} chev The chevron container
 * @param {Object} _module The module to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized module
 */
const initialize = function (chev, _module, constructorFunction) {
    const list = {};

    //Recurse trough module dependencies
    recurseDependencies(
        chev,
        _module,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //Add the dependency, and init it if its not ready
            list[dependency.name] = dependency.rdy ? dependency : dependency.init();
        }
    );

    return constructModule(_module, list, constructorFunction);
};

export default initialize;
