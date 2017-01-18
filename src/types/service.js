"use strict";

/**
 * Constructor function for the service module type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependencies
 * @returns {Mixed} Initialized module
 */
const service = function (_module, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = _module.fn;

    _module.fn = function () {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
    };

    return _module;
};

export default service;
