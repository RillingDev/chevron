"use strict";

import prepare from "../access/prepare";
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
    const entry = {
        type,
        name,
        deps,
        fn,
        rdy: false,
        init: function () {
            return prepare.call(_this, entry, cf);
        },
    };

    _this.chev.set(name, entry);

    return _this;
}
