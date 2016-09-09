/**
 * Chevron v5.2.0
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/chevronjs#readme
 * License: MIT
 */

/**
 * Collects dependencies and initializes service
 *
 * @private
 * @param {Object} _this The context
 * @param {Object} service The service to check
 * @param {Object} list The list of dependencies
 * @returns {Object} Returns `service`
 */
function initialize (service, list, cf) {
    if (!service.rdy) {
        const bundle = [];

        //Collect an ordered Array of dependencies
        service.deps.forEach(item => {
            const dependency = list[item];

            if (dependency) {
                bundle.push(dependency.fn);
            }
        });

        //Init service
        //Call Constructor fn with service/deps
        service = cf(service, bundle);
        service.rdy = true;
    }

    return service;
}

/**
 * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
 *
 * @private
 * @param {Object} _this The context
 * @param {Array} service The dependencyList to iterate
 * @param {Function} fn The function run over each dependency
 * @returns void
 */
function recurseDependencies(_this, service, fn) {
    //loop trough deps
    service.deps.forEach(name => {
        const dependency = _this.chev.get(name);

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies(_this, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if not found error with name
            throw _this.id + ": error in " + service.name + ": dep " + name + " missing";
        }
    });
}

/**
 * Check if every dependency is available
 *
 * @private
 * @param {Object} service The service to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized service
 */
function prepare (service, cf) {
    const list = {};

    //Recurse trough service deps
    recurseDependencies(
        this,
        service,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //make sure if dependency is initialized, then add
            list[dependency.name] = dependency.init();
        }
    );

    return initialize(service, list, cf);
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
    const _this = this;
    const entry = {
        type,
        name,
        deps,
        fn,
        rdy: false,
        init: function () {
            return prepare.call(_this, entry, cf);
        },
    };

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
    const _this = this;

    //Add customType method to container
    _this[type] = function (name, deps, fn) {
        return _this.provider(type, cf, name, deps, fn);
    };

    return _this;
}

/**
 * Access service with dependencies bound
 *
 * @param {String} name The Name of the service
 * @returns {*} Returns Content of the service
 */
function access (name) {
    const accessedService = this.chev.get(name);

    //Check if accessed service is registered
    if (accessedService) {
        //Call prepare with bound context
        return accessedService.init().fn;
    }
}

/**
 * Creates method entry for service
 *
 * @private
 * @returns Returns void
 */
function initService () {
    this.extend("service", function (service, bundle) {
        //dereference fn to avoid unwanted recursion
        const serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
        };

        return service;
    });
}

/**
 * Creates method entry for factory
 *
 * @private
 * @returns Returns void
 */
function initFactory() {
    this.extend("factory", function(service, bundle) {
        //First value gets ignored by calling 'new' like this, so we need to fill it
        bundle.unshift(0);

        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

        return service;
    });
}

/**
 * Basic Chevron Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Chevron instance
 */
const Chevron = function(id) {
    const _this = this;

    //Instance Id
    _this.id = id || "cv";
    //Instance container
    _this.chev = new Map();

    //Init default types
    initService.call(_this);
    initFactory.call(_this);
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    //Core service/factory method
    provider,
    //Prepare/init services/factory with deps injected
    access,
    //Add new service type
    extend
};

export default Chevron;