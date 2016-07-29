"use strict";

import provider from "./provider/provider";
import service from "./provider/service";
import factory from "./provider/factory";

import access from "./access/access";

import initService from "./init/initService";
import initFactory from "./init/initFactory";

/**
 * Basic Chevron Constructor
 * @constructor
 * @param String to id the container
 */
let Chevron = function (id) {
    let _this = this;

    _this.id = id || "cv";
    _this.chev = {};
    _this.tf = {
        service: initService,
        factory: initFactory
    };
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    //Core service/factory method
    provider,
    //Create new service
    service,
    //Create new factory
    factory,
    //Prepare/init services/factory with deps injected
    access
};

export default Chevron;
