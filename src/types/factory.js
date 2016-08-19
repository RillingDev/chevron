"use strict";

import {
    _factory
} from "../constants";

/**
 * Creates method entry for factory
 *
 * @private
 * @param {Object} _this The context
 * @returns Returns void
 */
export default function(_this) {
    _this.extend(_factory, function(service, bundle) {
        //First value gets ignored by calling new like this, so we need to fill it
        bundle.unshift(null);

        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

        return service;
    });
}
