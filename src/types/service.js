"use strict";

/**
 * Constructor function for the service type
 * @private
 * @param {Object} module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */
export default function(module, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = module.fn;

    module.fn = function() {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
    };

    return module;
}
