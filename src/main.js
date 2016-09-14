"use strict";

import provider from "./api/provider";
import extend from "./api/extend";
import access from "./access/access";

import initService from "./types/service";
import initFactory from "./types/factory";

/**
 * Chevron Constructor
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Chevron instance
 */
const Chevron = function (id) {
    const _this = this;

    _this.id = id || "cv"; //Instance Id
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
    access //Access module with dependencies bound
};

export default Chevron;
