"use strict";

import {
    _part1,
    _service,
    _error
} from "../constants";

/**
 * Checks if service exist, else add it
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @return this
 */
export default function (name, deps, type, fn) {
    let _this = this;

    if (_this.chev[name]) {
        //throw error if a service with this name already exists
        throw `${_this.id}${_error}${type}${_part1}${_service} '${name}' is already defined`;
    } else {
        //Add the service to container
        _this.chev[name] = {
            name,
            type,
            deps,
            fn,
            init: false
        };

        return _this;
    }
}
