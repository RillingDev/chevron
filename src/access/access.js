"use strict";

/**
 * Access module with dependencies bound
 *
 * @param {String} name The Name of the module
 * @returns {*} Returns Content of the module
 */
export default function (name) {
    const accessedModule = this.chev.get(name);

    //Check if accessed module is registered
    if (accessedModule) {
        //Call prepare with bound context
        return accessedModule.init().fn;
    }
}
