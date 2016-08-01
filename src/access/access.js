"use strict";

import prepare from "./prepare";
import {
    _more,
    _errorStart,
    _isUndefined
} from "../constants";

/**
 * Access service with dependencies bound
 * @param String name of the service
 * @return Function with dependencies bound
 */
export default function (name) {
    const _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        //Call prepare with bound context
        return prepare(_this, accessedService).fn;
    } else {
        //throw error if service does not exist
        throw _errorStart(_this) + name + _more + name + _isUndefined;
    }
}
