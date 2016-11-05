"use strict";

import initialize from "./initialize";
import recurseDependencies from "./recurseDependencies";

/**
 * Inits module and all dependencies
 * @private
 * @param {Object} chev The chevron container
 * @param {Object} module The module to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized module
 */
const prepare =function(chev, module, cf) {
    const list = {};

    //Recurse trough module deps
    recurseDependencies(
        chev,
        module,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //make sure if dependency is initialized, then add
            list[dependency.name] = dependency.init();
        }
    );

    return initialize(module, list, cf);
};

export default prepare;
