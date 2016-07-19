"use strict";

import provider from "./provider/provider";
import service from "./provider/service";
import factory from "./provider/factory";

import access from "./access";

let Container = function (name) {
    let _this = this;

    _this.name = name || "cv";
    _this.container = {};

    /*####################/
    * Internal Chevron methods
    /####################*/
    _this.$c = {
        exists(name) {
            return typeof _this.$c.get(name) !== "undefined";
        },
        get(name) {
            return _this.container[name];
        },
    };
};

Container.prototype = {
    /*####################/
    * Main exposed methods
    /####################*/
    //Core service/factory method
    provider,
    //create new service
    service,
    //create new factory
    factory,
    //prepare/iialize services/factory with d injected
    access
};

export default Container;
