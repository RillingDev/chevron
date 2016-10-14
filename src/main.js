"use strict";
var extend_1 = require("./api/extend");
var provider_1 = require("./api/provider");
var access_1 = require("./api/access");
var service_1 = require("./types/service");
var factory_1 = require("./types/factory");
/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
var Chevron = function () {
    var _this = this;
    _this.chev = new Map(); //Instance container
    //Init default types
    _this.extend("service", service_1["default"]);
    _this.extend("factory", factory_1["default"]);
};
/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    extend: extend_1["default"],
    provider: provider_1["default"],
    access: access_1["default"] //Returns initialized module
};
exports.__esModule = true;
exports["default"] = Chevron;
