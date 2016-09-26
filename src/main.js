"use strict";

import provider from "./api/provider";
import extend from "./api/extend";

import initService from "./types/service";
import initFactory from "./types/factory";

/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
const Chevron = function() {
    const _this = this;

    _this.chev = new Map(); //Instance container

    //Init default types
    initService(_this);
    initFactory(_this);
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    extend, //Adds a new module to the container
    provider, //Adds a new module to the container
    access: function(name) {
        //Access module with dependencies bound
        return this.chev.get(name).init().fn;
    }
};

export default Chevron;
