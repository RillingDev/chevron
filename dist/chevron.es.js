/**
 * Chevron 7.0.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/chevronjs.git
 */

const typeService = function (moduleContent, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = moduleContent;

    moduleContent = function () {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
    };

    return moduleContent;
};

const typeFactory = function (moduleContent, dependencies) {
    //dereference array, because we dont wanna mutate the arg
    const dependenciesArr = Array.from(dependencies);
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependenciesArr.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    moduleContent = new(Function.prototype.bind.apply(moduleContent, dependenciesArr));

    return moduleContent;
};

/**
 * @private
 * @param {Map} $map Chevron instance map
 * @param {Object} _module module
 * @param {Function} constructorFunction function init the module with
 * @returns {Mixed} constructed module content
 */
const construct = function ($map, _module, constructorFunction) {
    const dependencies = [];

    //Collects dependencies
    _module.deps.forEach(depName => {
        const dependency = $map.get(depName);

        if (dependency) {
            dependencies.push(dependency.rdy ? dependency.fn : dependency.init());
        } else {
            throw new Error(`Missing '${depName}'`);
        }
    });

    _module.fn = constructorFunction(_module.fn, dependencies);
    _module.rdy = true;

    return _module.fn;
};

/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
const ChevronMain = class {
    constructor() {
        const _this = this;

        //Instance container
        _this.$map = new Map();

        //Adds default types
        _this.extend("service", typeService);
        _this.extend("factory", typeFactory);
    }
    extend(typeName, constructorFunction) {
        /**
         * Defines a new module type
         */
        const _this = this;

        //stores type with name into instance
        _this[typeName] = function (id, deps, fn) {
            _this.provider(id, deps, fn, constructorFunction);
        };

        return _this;
    }
    provider(id, deps, fn, constructorFunction) {
        /**
         * Adds a new module to the container
         */
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
        /**
         * Accesses and inits a module
         */
        const _module = this.$map.get(id);

        return _module.rdy ? _module.fn : _module.init();
    }
};

export default ChevronMain;
