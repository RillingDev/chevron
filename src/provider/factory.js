"use strict";

import {
    _factory
} from "../constants";

/**
 * Create a new factory
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @return Chevron instance
 */
export default function (_this) {
    _this.extend(_factory, function (service, bundle) {
        //Construct factory
        //first value gets ignored by calling new like this, so we need to fill it
        bundle.unshift(null);
        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

        return service;
    });
}
