"use strict";

/**
 * Creates method entry for service
 *
 * @private
 * @returns Returns void
 */
export default function () {
    this.extend("service", function (service, bundle) {
        //dereference fn to avoid unwanted recursion
        const serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
        };

        return service;
    });
}
