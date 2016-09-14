"use strict";

/**
 * Adds a new service type
 *
 * @param {String} type The name of the type
 * @param {Function} cf Constructor function to init the service with
 * @returns {Object} Returns `this`
 */
export default function (type, cf) {
    const _this = this;

    //Add customType method to container
    _this[type] = function (name, deps, fn) {
        return _this.provider(
            type, //static
            cf, //static
            name, //dynamic
            deps, //dynamic
            fn //dynamic
        );
    };

    return _this;
}
