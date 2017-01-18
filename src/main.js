"use strict";

import extend from "./api/extend";
import provider from "./api/provider";
import access from "./api/access";

import initService from "./types/service";
import initFactory from "./types/factory";

/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
const Chevron = function () {
    const _this = this;

    //Instance container
    _this.$map = new Map();

    //Init default types
    _this.extend("service", initService);
    _this.extend("factory", initFactory);

    return _this;
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    extend, //Creates a new module type
    provider, //Adds a new custom module to the container
    access //Returns initialized module
};

export default Chevron;
