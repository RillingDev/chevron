"use strict";

/**
 * Service-type constructor function
 *
 * @private
 * @param {Function} moduleContent module to be constructed as service
 * @param {Array} dependencies Array of dependency contents
 * @returns {Function} constructed function
 */
const typeService = function (moduleContent, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = moduleContent;

    moduleContent = function () {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn(...dependencies, ...arguments);
    };

    return moduleContent;
};

export default typeService;
