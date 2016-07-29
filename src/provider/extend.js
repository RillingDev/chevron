"use strict";

/**
 * Adds a new service type
 * @param String name of the type
 * @param fn to call when the service is constructed
 * @return Chevron instance
 */
export default function (type, fn) {
    let _this = this;

    _this.tl[type] = fn;
    _this[type] = function (name, deps, fn) {
        return _this.provider(type, name, deps, fn);
    }

    return _this;
}
