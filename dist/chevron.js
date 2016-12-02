/**
 * Chevron v6.3.3
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

var extend = function extend(type, cf) {
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
 * @param {Object} _module The module to check
 * @param {Object} list The list of dependencies
 * @param {Function} cf The Constructor function
 * @returns {Object} Initialized module
 */

var constructModule = function constructModule(_module, list, constructorFunction) {
    var dependencies = [];
    var result = void 0;

    //Collect an ordered Array of dependencies
    _module.deps.forEach(function (item) {
        var dependency = list[item];

        //If the dependency name is found in the list of deps, add it
        if (dependency) {
            dependencies.push(dependency.fn);
        }
    });

    //Call Constructor fn with module and dependencies
    result = constructorFunction(_module, dependencies);
    result.rdy = true;

    return result;
};

/**
 * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
 * @private
 * @param {Object} chev The chevron container
 * @param {Array} _module The module to recurse
 * @param {Function} fn The function run over each dependency
 */

var recurseDependencies = function recurseDependencies(chev, _module, fn) {
    _module.deps.forEach(function (name) {
        var dependency = chev.get(name);

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies(chev, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if the dependency is not found, throw error with name
            throw new Error(_module.name + " is missing dep '" + name + "'");
        }
    });
};

/**
 * Inits module and all dependencies
 * @private
 * @param {Object} chev The chevron container
 * @param {Object} _module The module to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized module
 */
var initialize = function initialize(chev, _module, constructorFunction) {
    var list = {};

    //Recurse trough module dependencies
    recurseDependencies(chev, _module,
    //run this over every dependency to add it to the dependencyList
    function (dependency) {
        //Add the dependency, and init it if its not ready
        list[dependency.name] = dependency.rdy ? dependency : dependency.init();
    });

    return constructModule(_module, list, constructorFunction);
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
var provider = function provider(type, constructorFunction, name, deps, fn) {
    var _this = this;
    var entry = {
        type: type, //Type of the module
        name: name, //Name of the module
        deps: deps, //Array of dependencies
        fn: fn, //Module content function
        rdy: false, //If the module is ready to access
        init: function init() {
            return initialize(_this.chev, entry, constructorFunction); //init the module
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

var access = function access(name) {
  return this.chev.get(name).init().fn;
};

/**
 * Constructor function for the service module type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependencies
 * @returns {Mixed} Initialized module
 */

var service = function service(_module, dependencies) {
    //Dereference fn to avoid unwanted recursion
    var serviceFn = _module.fn;

    _module.fn = function () {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
    };

    return _module;
};

/**
 * Constructor function for the factory module type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependencies
 * @returns {Mixed} Initialized module
 */

var factory = function factory(_module, dependencies) {
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    _module.fn = new (Function.prototype.bind.apply(_module.fn, dependencies))();

    return _module;
};

/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
var Chevron = function Chevron() {
    var _this = this;

    //Instance container
    _this.chev = new Map();

    //Init default types
    _this.extend("service", service);
    _this.extend("factory", factory);

    return _this;
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
