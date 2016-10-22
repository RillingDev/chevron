/**
 * Chevron v5.6.1
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/chevronjs#readme
 * License: MIT
 */

'use strict';

/**
 * Adds a new module type to the Chevron instance
 * @param {String} type The name of the type
 * @param {Function} cf Constructor function to init the module with
 * @returns {Object} Chevron instance
 */
var extend = function(type, cf) {
    const _this = this;

    //Add customType method to container
    _this[type] = function(name, deps, fn) {
        return _this.provider(
            type, //static
            cf, //static
            name, //dynamic
            deps, //dynamic
            fn //dynamic
        );
    };

    return _this;
};

/**
 * Collects dependencies and initializes module
 * @private
 * @param {Object} module The module to check
 * @param {Object} list The list of dependencies
 * @param {Function} cf The Constructor function
 * @returns {Object} Initialized module
 */
var initialize = function(module, list, cf) {
    //Only init if its not already initializes
    if (!module.rdy) {
        const dependencies = [];

        //Collect an ordered Array of dependencies
        module.deps.forEach(item => {
            const dependency = list[item];

            //If the dependency name is found in the list of deps, add it
            if (dependency) {
                dependencies.push(dependency.fn);
            }
        });

        //Init module
        //Call Constructor fn with module/deps
        module = cf(module, dependencies);
        module.rdy = true;
    }

    return module;
};

/**
 * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
 * @private
 * @param {Object} chev The chevron container
 * @param {Array} module The dependencyList to iterate
 * @param {Function} fn The function run over each dependency
 */
const recurseDependencies = function(chev, module, fn) {
    //loop trough deps
    module.deps.forEach(name => {
        const dependency = chev.get(name);

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies(chev, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if the dependency isnot found, throw error with name
            throw new Error(module.name + " is missing dep '" + name + "'");
        }
    });
};

/**
 * Inits module and all dependencies
 * @private
 * @param {Object} chev The chevron container
 * @param {Object} module The module to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized module
 */
var prepare = function(chev, module, cf) {
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
};

/**
 * Adds a new module to the container
 * @param {String} type The type of the module. ex: "factory"
 * @param {Function} cf The constructor function of the module
 * @param {String} name The name to register the module under. ex: "myFactory"
 * @param {Array} deps Array of dependenciy names
 * @param {Function} fn Content of the module
 * @returns {Object} Chevron instance
 */
var provider = function(type, cf, name, deps, fn) {
    const _this = this;
    const entry = {
        type, //Type of the module
        name, //Name of the module
        deps, //Array of dependencies
        fn, //Module content function
        rdy: false, //If the module is ready to access
        init: function() {
            return prepare(_this.chev, entry, cf); //init the module
        }
    };

    //Saves entry to chev container
    _this.chev.set(name, entry);

    return _this;
};

/**
 * Access module with dependencies bound
 * @param {String} name The name of the module to access
 * @returns {Mixed} Initialized Object content
 */
var access = function(name) {
    return this.chev.get(name).init().fn;
};

/**
 * Constructor function for the service type
 * @private
 * @param {Object} module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */
var initService = function(module, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = module.fn;

    module.fn = function() {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
    };

    return module;
};

/**
 * Constructor function for the factory type
 * @private
 * @param {Object} module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */
var initFactory = function(module, dependencies) {
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    module.fn = new(Function.prototype.bind.apply(module.fn, dependencies));

    return module;
};

/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
const Chevron = function() {
    const _this = this;

    _this.chev = new Map(); //Instance container

    //Init default types
    _this.extend("service", initService);
    _this.extend("factory", initFactory);
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    extend, //Creates a new module type
    provider, //Adds a new custom module to the container
    access //Returns initialized module
};

module.exports = Chevron;
