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
let Chevron = function (id) {
    const _this = this;

    //Instance Id
    _this.id = id || "cv";
    //Instance transformerList
    _this.tl = {};
    //Instance container
    _this.chev = {};

    //Init default types
    initService(_this);
    initFactory(_this);
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
