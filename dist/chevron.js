/**
 * Chevron v5.6.1
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/chevronjs.git
 */

var Chevron = (function () {
'use strict';

/**
 * Adds a new module type to the Chevron instance
 * @param {String} type The name of the type
 * @param {Function} cf Constructor function to init the module with
 * @returns {Object} Chevron instance
 */

var extend = function (type, cf) {
    var _this = this;

    //Add customType method to container
    _this[type] = function (name, deps, fn) {
        return _this.provider(type, //static
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

var initialize = function (module, list, cf) {
    //Only init if its not already initializes
    if (!module.rdy) {
        (function () {
            var dependencies = [];

            //Collect an ordered Array of dependencies
            module.deps.forEach(function (item) {
                var dependency = list[item];

                //If the dependency name is found in the list of deps, add it
                if (dependency) {
                    dependencies.push(dependency.fn);
                }
            });

            //Init module
            //Call Constructor fn with module/deps
            module = cf(module, dependencies);
            module.rdy = true;
        })();
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

var recurseDependencies = function recurseDependencies(chev, module, fn) {
    //loop trough deps
    module.deps.forEach(function (name) {
        var dependency = chev.get(name);

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
var prepare = function (chev, module, cf) {
    var list = {};

    //Recurse trough module deps
    recurseDependencies(chev, module,
    //run this over every dependency to add it to the dependencyList
    function (dependency) {
        //make sure if dependency is initialized, then add
        list[dependency.name] = dependency.init();
    });

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
var provider = function (type, cf, name, deps, fn) {
    var _this = this;
    var entry = {
        type: type, //Type of the module
        name: name, //Name of the module
        deps: deps, //Array of dependencies
        fn: fn, //Module content function
        rdy: false, //If the module is ready to access
        init: function init() {
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

var access = function (name) {
  return this.chev.get(name).init().fn;
};

/**
 * Constructor function for the service type
 * @private
 * @param {Object} module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */

var initService = function (module, dependencies) {
    //Dereference fn to avoid unwanted recursion
    var serviceFn = module.fn;

    module.fn = function () {
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

var initFactory = function (module, dependencies) {
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    module.fn = new (Function.prototype.bind.apply(module.fn, dependencies))();

    return module;
};

/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
var Chevron = function Chevron() {
    var _this = this;

    _this.chev = new Map(); //Instance container

    //Init default types
    _this.extend("service", initService);
    _this.extend("factory", initFactory);
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    extend: extend, //Creates a new module type
    provider: provider, //Adds a new custom module to the container
    access: access //Returns initialized module
};

return Chevron;

}());

//# sourceMappingURL=chevron.js.map
