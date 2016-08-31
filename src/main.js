"use strict";

import provider from "./api/provider";
import extend from "./api/extend";
import access from "./access/access";

import initService from "./types/service";
import initFactory from "./types/factory";

/**
 * Basic Chevron Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Chevron instance
 */
const Chevron = function(id) {
    const _this = this;

    //Instance Id
    _this.id = id || "cv";
    //Instance container
    _this.chev = new Map();

    //Init default types
    initService.call(_this);
    initFactory.call(_this);
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    //Core service/factory method
    provider,
    //Prepare/init services/factory with deps injected
    access,
    //Add new service type
    extend
};

export default Chevron;
