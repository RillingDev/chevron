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
    let _this = this;

    _this.id = id || "cv";
    _this.chev = {};
    _this.tl = {};

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
