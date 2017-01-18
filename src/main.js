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

        _this.extend("service", typeService);
        _this.extend("factory", typeFactory);
    }
    extend(typeName, cf) {
        const _this = this;

        _this[typeName] = function (id, deps, fn) {
            _this.provider(id, deps, fn, cf);
        };
    }
    provider(id, deps, fn, cf) {
        const _this = this;
        const entry = {
            deps,
            fn,
            init: false,
            construct: function () {
                return construct(_this.$map, entry, cf);
            }
        };

        _this.$map.set(id, entry);
    }
    access(id) {
        const _module = this.$map.get(id);

        return _module.init ? _module.fn : _module.construct();
    }
};

export default Chevron;
