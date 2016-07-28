"use strict";

import prepare from "./prepare";
import {
    _part1,
    _error,
    _isUndefined
} from "../constants";

/**
 * Access service with dependencies bound
 * @param String name of the service
 * @return Function with dependencies bound
 */
export default function (name) {
    let _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        //Call prepare with bound context
        return prepare.call(_this, accessedService).fn;
    } else {
        //throw error if service does not exist
        throw `${_this.id}${_error}${name}${_part1}'${name}'${_isUndefined}`;
    }
}
