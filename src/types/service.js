"use strict";

import {
    _service
} from "../constants";

/**
 * Creates method entry for service
 *
 * @private
 * @param {Object} _this The context
 * @returns Returns void
 */
export default function(_this) {
    _this.extend(_service, function(service, bundle) {
        //Construct service
        const serviceFn = service.fn;

        service.fn = function() {
            //Chevron service function wrapper
            return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
        };

        return service;
    });
}
