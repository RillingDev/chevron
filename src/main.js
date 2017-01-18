"use strict";


import typeService from "./types/service";
import typeFactory from "./types/factory";

import construct from "./lib/construct";

/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
const Chevron = class {
    constructor() {
        const _this = this;

        //Instance container
        _this.$map = new Map();

        //Adds default types
        _this.extend("service", typeService);
        _this.extend("factory", typeFactory);
    }
    extend(typeName, constructorFunction) {
        const _this = this;

        //stores type with name into instance
        _this[typeName] = function (id, deps, fn) {
            _this.provider(id, deps, fn, constructorFunction);
        };

        return _this;
    }
    provider(id, deps, fn, constructorFunction) {
        const _this = this;
        const _module = {
            deps,
            fn,
            rdy: false,
            init: function () {
                return construct(_this.$map, _module, constructorFunction);
            }
        };

        _this.$map.set(id, _module);

        return _this;
    }
    access(id) {
        const _module = this.$map.get(id);

        return _module.rdy ? _module.fn : _module.init();
    }
};

export default Chevron;
