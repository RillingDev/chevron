"use strict";

import initModule from "./initModule";
import typeService from "./types/service";
import typeFactory from "./types/factory";

/**
 * Chevron Class
 * @class
 */
const Chevron = class {
    /**
     * Chevron Constructor
     * @constructor
     * @returns {Chevron} Chevron instance
     */
    constructor() {
        const _this = this;

        //Instance container
        _this.$ = new Map();

        // Adds default types
        _this.extend("service", typeService);
        _this.extend("factory", typeFactory);
    }
    /**
     * Defines a new module type
     * @param {String} typeName name of the new type
     * @param {Function} constructorFunction function init modules with
     * @returns {Chevron} Chevron instance
     */
    extend(typeName, constructorFunction) {
        const _this = this;

        //stores type as set with name into instance
        _this[typeName] = function (id, dependencies, fn) {
            _this.set(id, dependencies, fn, constructorFunction);
        };

        return _this;
    }
    /**
     * Defines a new module
     * @param {String} moduleName name of the module
     * @param {Array} dependencies array of dependency names
     * @param {Function} content module content
     * @param {Function} constructorFunction function init the modules with
     * @returns {Chevron} Chevron instance
     */
    set(moduleName, dependencies, content, constructorFunction) {
        const _this = this;
        const _module = {
            c: content,
            r: false,
        };

        _module.i = initModule(_this.$, _module, dependencies, constructorFunction);
        _this.$.set(moduleName, _module);

        return _this;
    }
    /**
     * Access and init a module
     * @param {String} moduleName name of the module to access
     * @returns {Mixed} module content
     */
    get(moduleName) {
        const _module = this.$.get(moduleName);

        return _module.r ? _module.c : _module.i();
    }
};

export default Chevron;
