"use strict";

import provider from "./provider/provider";
import service from "./provider/service";
import factory from "./provider/factory";

import access from "./access/access";

let Container = function (name) {
    let _this = this;

    _this.name = name || "cv";
    _this.chev = {};

};

Container.prototype = {
    //Core service/factory method
    provider,
    //create new service
    service,
    //create new factory
    factory,
    //prepare/iialize services/factory with deps injected
    access
};

export default Container;
