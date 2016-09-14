"use strict";

/**
 * Creates method entry for service
 *
 * @private
 * @param {Object} context Context to extend
 */
export default function (context) {
    context.extend("service", function (service, bundle) {
        //dereference fn to avoid unwanted recursion
        const serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            //Concat dependencies and arguments
            const args = bundle.concat(Array.from(arguments));
            //return function with args injected
            return serviceFn.apply(null, args);
        };

        return service;
    });
}
