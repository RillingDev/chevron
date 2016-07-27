"use strict";

import provider from "./provider/provider";
import service from "./provider/service";
import factory from "./provider/factory";
import access from "./access/access";

/**
 * Basic Chevron Constructor
 * @constructor
 */
let Chevron = function (id) {
    this.id = id || "cv";
    this.chev = {};
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
