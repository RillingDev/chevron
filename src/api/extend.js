"use strict";

/**
 * Adds a new service type
 *
 * @param {String} type The name of the type
 * @param {Function} transformer Call this when the service is constructed
 * @return {Object} `this`
 */
export default function(type, transformer) {
    const _this = this;

    //Add transformer to typeList
    _this.tl[type] = transformer;

    //Add customType method to container
    _this[type] = function(name, deps, fn) {
        return _this.provider(type, name, deps, fn);
    };

    return _this;
}
