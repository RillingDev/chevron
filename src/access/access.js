"use strict";

/**
 * Access service with dependencies bound
 *
 * @param {String} name The Name of the service
 * @returns {*} Returns Content of the service
 */
export default function (name) {
    const accessedService = this.chev.get(name);

    //Check if accessed service is registered
    if (accessedService) {
        //Call prepare with bound context
        return accessedService.init().fn;
    }
}
