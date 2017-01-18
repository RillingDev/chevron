"use strict";

/**
 * Access module with dependencies bound
 * @param {String} name The name of the module to access
 * @returns {Mixed} Initialized Object content
 */
const access = function (name) {
    return this.$map.get(name).init().fn;
};

export default access;
