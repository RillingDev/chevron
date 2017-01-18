/**
 * Chevron 7.0.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/chevronjs.git
 */

'use strict';

const typeService = function (_module, dependencies) {
    console.log("SERVICE", _module, dependencies);

    //Dereference fn to avoid unwanted recursion
    const serviceFn = _module.fn;

    _module.fn = function () {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
    };

    return _module;
};

const typeFactory = function (_module, dependencies) {
    console.log("FACTORY", _module, dependencies);

    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    _module.fn = new(Function.prototype.bind.apply(_module.fn, dependencies));

    return _module;
};

const construct = function ($map, _module, cf) {
    const dependencies = [];
    let constructedModule;

    _module.deps.forEach(depName => {
        const dependency = $map.get(depName);

        if (dependency) {
            dependencies.push(dependency.init === true ? dependency.fn : dependency.construct());
        } else {
            throw new Error("missing " + depName);
        }
    });

    constructedModule = cf(_module, dependencies);
    _module.init = true;

    return constructedModule.fn;
};

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

module.exports = Chevron;
