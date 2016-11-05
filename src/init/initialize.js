"use strict";

/**
 * Collects dependencies and initializes module
 * @private
 * @param {Object} module The module to check
 * @param {Object} list The list of dependencies
 * @param {Function} cf The Constructor function
 * @returns {Object} Initialized module
 */
const initialize = function(module, list, cf) {
    //Only init if its not already initializes
    if (!module.rdy) {
        const dependencies = [];

        //Collect an ordered Array of dependencies
        module.deps.forEach(item => {
            const dependency = list[item];

            //If the dependency name is found in the list of deps, add it
            if (dependency) {
                dependencies.push(dependency.fn);
            }
        });

        //Init module
        //Call Constructor fn with module/deps
        module = cf(module, dependencies);
        module.rdy = true;
    }

    return module;
};

export default initialize;
