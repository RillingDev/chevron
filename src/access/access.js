"use strict";

import prepare from "./prepare";

/**
 * Access service with dependencies bound
 *
 * @param {String} name The Name of the service
 * @return {*} Content of the service
 */
export default function(name) {
    const _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        //Call prepare with bound context
        return prepare(_this, accessedService).fn;
    } else {
        //throw error if service does not exist
        throw false;
    }
}
