/**
 * Chevron 7.0.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/chevronjs.git
 */

var Chevron = (function () {
'use strict';

const typeService = function (_module, dependencies) {
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
    //dereference array, because we dont wanna mutate the arg
    const dependenciesArr = Array.from(dependencies);
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependenciesArr.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    _module.fn = new (Function.prototype.bind.apply(_module.fn, dependenciesArr))();

    return _module;
};

const construct = function ($map, _module, cf) {
    const dependencies = [];
    let constructedModule;

    //Collects dependencies
    _module.deps.forEach(depName => {
        const dependency = $map.get(depName);

        if (dependency) {
            dependencies.push(dependency.rdy ? dependency.fn : dependency.init());
        } else {
            throw new Error(`missing '${ depName }'`);
        }
    });

    constructedModule = cf(_module, dependencies);
    _module.rdy = true;

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

return Chevron;

}());

//# sourceMappingURL=chevron.js.map
