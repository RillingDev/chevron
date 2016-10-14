"use strict";

/**
 * Access module with dependencies bound
 * @param {String} name The name of the module to access
 * @returns {Mixed} Initialized Object content
 */
export default function(name) {
    return this.chev.get(name).init().fn;
}
