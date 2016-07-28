"use strict";

import {
    _service
} from "../constants";

/**
 * Initializes service/function
 * @private
 * @param Object service to check
 * @param Object bundle of dependencies
 * @return Object service
 */
export default function (service, bundle) {
    if (service.type === _service) {
        //Construct service
        let serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
        };
    } else {
        //Construct factory
        bundle = bundle.concat(service.args);
        //first value gets ignored by calling new like this, so we need to fill it
        bundle.unshift(null);
        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));
    }

    service.init = true;
    return service;
}
