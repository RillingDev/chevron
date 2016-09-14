/**
 * Chevron v5.3.0
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/chevronjs#readme
 * License: MIT
 */

var Chevron = (function () {
'use strict';

/**
 * Collects dependencies and initializes module
 *
 * @private
 * @param {Object} _this The context
 * @param {Object} module The module to check
 * @param {Object} list The list of dependencies
 * @returns {Object} Returns `module`
 */

function initialize (module, list, cf) {
    if (!module.rdy) {
        (function () {
            var bundle = [];

            //Collect an ordered Array of dependencies
            module.deps.forEach(function (item) {
                var dependency = list[item];

                if (dependency) {
                    bundle.push(dependency.fn);
                }
            });

            //Init module
            //Call Constructor fn with module/deps
            module = cf(module, bundle);
            module.rdy = true;
        })();
    }

    return module;
}

/**
 * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
 *
 * @private
 * @param {Object} _this The context
 * @param {Array} module The dependencyList to iterate
 * @param {Function} fn The function run over each dependency
 * @returns void
 */

function recurseDependencies(_this, module, fn) {
    //loop trough deps
    module.deps.forEach(function (name) {
        var dependency = _this.chev.get(name);

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies(_this, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if not found error with name
            throw _this.id + ": error in " + module.name + ": dep " + name + " missing";
        }
    });
}

/**
 * Check if every dependency is available
 *
 * @private
 * @param {Object} module The module to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized module
 */
function prepare (module, cf) {
    var list = {};

    //Recurse trough module deps
    recurseDependencies(this, module,
    //run this over every dependency to add it to the dependencyList
    function (dependency) {
        //make sure if dependency is initialized, then add
        list[dependency.name] = dependency.init();
    });

    return initialize(module, list, cf);
}

/**
 * Checks if service exist, else add it
 *
 * @param {String} type The type of the service (service/factory)
 * @param {Function} cf The Constructor function of the service
 * @param {String} name The name to register/id the service
 * @param {Array} deps List of dependencies
 * @param {Function} fn Content of the service
 * @returns {Object} Returns `this`
 */
function provider (type, cf, name, deps, fn) {
    var _this = this;
    var entry = {
        type: type, //Type of the module
        name: name, //Name of the module
        deps: deps, //Array of dependencies
        fn: fn, //Module content function
        rdy: false, //If the module is ready to access
        init: function init() {
            //init the module
            return prepare.call(_this, entry, cf);
        }
    };

    //Saves entry to chev container
    _this.chev.set(name, entry);

    return _this;
}

/**
 * Adds a new service type
 *
 * @param {String} type The name of the type
 * @param {Function} cf Constructor function to init the service with
 * @returns {Object} Returns `this`
 */

function extend (type, cf) {
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
}

/**
 * Access module with dependencies bound
 *
 * @param {String} name The Name of the module
 * @returns {*} Returns Content of the module
 */

function access (name) {
    var accessedModule = this.chev.get(name);

    //Check if accessed module is registered
    if (accessedModule) {
        //Call prepare with bound context
        return accessedModule.init().fn;
    }
}

/**
 * Creates method entry for service
 *
 * @private
 * @param {Object} context Context to extend
 */

function initService (context) {
    context.extend("service", function (service, bundle) {
        //dereference fn to avoid unwanted recursion
        var serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            //Concat dependencies and arguments
            var args = bundle.concat(Array.from(arguments));
            //return function with args injected
            return serviceFn.apply(null, args);
        };

        return service;
    });
}

/**
 * Creates method entry for factory
 *
 * @private
 * @param {Object} context Context to extend
 */

function initFactory (context) {
    context.extend("factory", function (service, bundle) {
        //First value gets ignored by calling 'new' like this, so we need to fill it
        bundle.unshift(0);

        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();

        return service;
    });
}

/**
 * Basic Chevron Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Chevron instance
 */
var Chevron = function Chevron(id) {
    var _this = this;

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
    provider: provider, //Core module creation method
    access: access, //Init and return module with dependencies injected
    extend: extend //Add new module type
};

return Chevron;

}());