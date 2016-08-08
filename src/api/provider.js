"use strict";

import {
    _more,
    _error
} from "../constants";

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
    const _this = this;

    if (_this.chev[name]) {
        //throw error if a service with this name already exists
        throw _this.id + _more + _error + name + " already exists";
    } else {
        //Add the service to container
        _this.chev[name] = {
            type,
            cf,
            name,
            deps,
            fn,
            init: false
        };

        return _this;
    }
}
