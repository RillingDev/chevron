"use strict";

import provider from "./provider/provider";
import extend from "./provider/extend";
import access from "./access/access";

import initService from "./provider/service";
import initFactory from "./provider/factory";

/**
 * Basic Chevron Constructor
 * @constructor
 * @param String to id the container
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
