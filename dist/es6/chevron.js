/**
 * Chevron v5.3.1
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/chevronjs#readme
 * License: MIT
 */

var Chevron = (function () {
'use strict';

/**
 * Collects dependencies and initializes module
 * @private
 * @param {Object} module The module to check
 * @param {Object} list The list of dependencies
 * @param {Function} cf The Constructor function
 * @returns {Object} Initialized module
 */
function initialize (module, list, cf) {
    //Only init if its not already initializes
    if (!module.rdy) {
        const bundle = [];

        //Collect an ordered Array of dependencies
        module.deps.forEach(item => {
            const dependency = list[item];

            //If the dependency name is found in the list of deps, add it
            if (dependency) {
                bundle.push(dependency.fn);
            }
        });

        //Init module
        //Call Constructor fn with module/deps
        module = cf(module, bundle);
        module.rdy = true;
    }

    return module;
}

/**
 * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
 * @private
 * @param {Object} chev The chevron container
 * @param {Array} module The dependencyList to iterate
 * @param {Function} fn The function run over each dependency
 */
function recurseDependencies(chev, module, fn) {
    //loop trough deps
    module.deps.forEach(name => {
        const dependency = chev.get(name);

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies(chev, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if not found, throw error with name
            throw "error in " + module.name + ": dep '" + name + "' missing";
        }
    });
}

/**
 * Check if every dependency is available
 * @private
 * @param {Object} chev The chevron container
 * @param {Object} module The module to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized module
 */
function prepare (chev, module, cf) {
    const list = {};

    //Recurse trough module deps
    recurseDependencies(
        chev,
        module,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //make sure if dependency is initialized, then add
            list[dependency.name] = dependency.init();
        }
    );

    return initialize(module, list, cf);
}

/**
 * Adds a new module to the container
 * @param {String} type The type of the service (service/factory)
 * @param {Function} cf The Constructor function of the service
 * @param {String} name The name to register/id the service
 * @param {Array} deps List of dependencies
 * @param {Function} fn Content of the service
 * @returns {Object} Chevron Instance
 */
function provider (type, cf, name, deps, fn) {
    const _this = this;
    const entry = {
        type, //Type of the module
        name, //Name of the module
        deps, //Array of dependencies
        fn, //Module content function
        rdy: false, //If the module is ready to access
        init: function () { //init the module
            return prepare(_this.chev, entry, cf);
        }
    };

    //Saves entry to chev container
    _this.chev.set(name, entry);

    return _this;
}

/**
 * Adds a new module type
 * @param {String} type The name of the type
 * @param {Function} cf Constructor function to init the module with
 * @returns {Object} Chevron Instance
 */
function extend (type, cf) {
    const _this = this;

    //Add customType method to container
    _this[type] = function (name, deps, fn) {
        return _this.provider(
            type, //static
            cf, //static
            name, //dynamic
            deps, //dynamic
            fn //dynamic
        );
    };

    return _this;
}

/**
 * Access module with dependencies bound
 * @param {String} name The name of the module
 * @returns {*} Content of the initialized module
 */
function access (name) {
    const accessedModule = this.chev.get(name);

    //Check if accessed module is registered
    if (accessedModule) {
        //Call prepare with bound context
        return accessedModule.init().fn;
    }
}

/**
 * Creates method entry for service
 * @private
 * @param {Object} context Context to extend
 */
function initService (context) {
    context.extend("service", function (service, bundle) {
        //dereference fn to avoid unwanted recursion
        const serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            //Concat dependencies and arguments
            const args = bundle.concat(Array.from(arguments));
            //return function with args injected
            return serviceFn.apply(null, args);
        };

        return service;
    });
}

/**
 * Creates method entry for factory
 * @private
 * @param {Object} context Context to extend
 */
function initFactory (context) {
    context.extend("factory", function (service, bundle) {
        //First value gets ignored by calling 'new' like this, so we need to fill it
        bundle.unshift(0);

        //Apply into new constructor by accessing bind proto.
        //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

        return service;
    });
}

/**
 * Chevron Constructor
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Chevron instance
 */
const Chevron = function (id) {
    const _this = this;

    _this.id = id || "cv"; //Instance Id
    _this.chev = new Map(); //Instance container

    //Init default types
    initService(_this);
    initFactory(_this);
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    extend, //Adds a new module to the container
    provider, //Adds a new module to the container
    access //Access module with dependencies bound
};

return Chevron;

}());