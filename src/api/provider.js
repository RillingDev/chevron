"use strict";

import {
    _more,
    _error
} from "../constants";
import prepare from "../access/prepare";
/**
 * Checks if service exist, else add it
 *
 * @param {String} type The type of the service (service/factory)
 * @param {Function} cf The Constructor function of the service
 * @param {String} name The name to register/id the service
 * @param {Array} deps List of dependencies
 * @param {Function} fn Content of the service
 * @returns {Object} Returns `this`
 */
export default function (type, cf, name, deps, fn) {
    const _this = this,
        entry = {
            type,
            name,
            deps,
            fn,
            ready: false,
            init: function () {
                return prepare.call(_this, entry, cf);
            },
        };

    _this.chev.set(name, entry);

    return _this;

}
