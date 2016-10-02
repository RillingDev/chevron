"use strict";

/**
 * Creates method entry for service
 * @private
 * @param {Object} context Context to extend
 */
export default function (context) {
    context.extend("service", function (module, dependencies) {
        //Dereference fn to avoid unwanted recursion
        const serviceFn = module.fn;

        module.fn = function () {
            //Chevron service function wrapper
            //return function with args injected
            return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
        };

        return module;
    });
}
