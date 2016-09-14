"use strict";

/**
 * Collects dependencies and initializes module
 *
 * @private
 * @param {Object} _this The context
 * @param {Object} module The module to check
 * @param {Object} list The list of dependencies
 * @returns {Object} Returns `module`
 */
export default function (module, list, cf) {
    if (!module.rdy) {
        const bundle = [];

        //Collect an ordered Array of dependencies
        module.deps.forEach(item => {
            const dependency = list[item];

            if (dependency) {
                bundle.push(dependency.fn);
            }
        });

        //Init module
        //Call Constructor fn with module/deps
        module = cf(module, bundle);
        module.rdy = true;
    }

    return module;
}
