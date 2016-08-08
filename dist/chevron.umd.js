(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('chevron', factory) :
    (global.Chevron = factory());
}(this, function () { 'use strict';

    const _more = ": ";
    const _error = "error in ";
    const _factory = "factory";
    const _service = "service";
    const _isUndefined = " is undefined";

    /**
     * Checks if service exist, else add it
     *
     * @param {String} type The type of the service (service/factory)
     * @param {String} name The name to register/id the service
     * @param {Array} deps List of dependencies
     * @param {Function} fn Content of the service
     * @returns {Object} Returns `this`
     */
    function provider(type, name, deps, fn) {
        const _this = this;

        if (_this.chev[name]) {
            //throw error if a service with this name already exists
            throw _this.id + _more + _error + name + " already exists";
        } else {
            //Add the service to container
            _this.chev[name] = {
                type,
                name,
                deps,
                fn,
                init: false
            };

            return _this;
        }
    }

    /**
     * Adds a new service type
     *
     * @param {String} type The name of the type
     * @param {Function} transformer Call this when the service is constructed
     * @returns {Object} Returns `this`
     */
    function extend(type, transformer) {
        const _this = this;

        //Add transformer to typeList
        _this.tl[type] = transformer;

        //Add customType method to container
        _this[type] = function(name, deps, fn) {
            return _this.provider(type, name, deps, fn);
        };

        return _this;
    }

    /**
     * Collects dependencies and initializes service
     *
     * @private
     * @param {Object} _this The context
     * @param {Object} service The service to check
     * @param {Object} list The list of dependencies
     * @returns {Object} Returns `service`
     */
    function initialize(_this, service, list) {
        if (!service.init) {
            let bundle = [];

            service.deps.forEach(item => {
                const dependency = list[item];

                if (dependency) {
                    bundle.push(dependency.fn);
                }
            });

            //Init service
            service = _this.tl[service.type](service, bundle);
            service.init = true;
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
            const dependency = _this.chev[name];

            if (dependency) {
                //recurse over sub-deps
                recurseDependencies(_this, dependency, fn);
                //run fn
                fn(dependency);
            } else {
                //if not found error with name
                throw _this.id + _more + _error + service.name + _more + "dependency " + name + _isUndefined;
            }
        });
    }

    /**
     * Check if every dependency is available
     *
     * @private
     * @param {Object} _this The context
     * @param {Object} service The service to prepare
     * @returns {Object} Initialized service
     */
    function prepare(_this, service) {
        const list = {};

        //Recurse trough service deps
        recurseDependencies(
            _this,
            service,
            //run this over every dependency to add it to the dependencyList
            dependency => {
                //make sure if dependency is initialized, then add
                list[dependency.name] = initialize(_this, dependency, list);
            }
        );

        return initialize(_this, service, list);
    }

    /**
     * Access service with dependencies bound
     *
     * @param {String} name The Name of the service
     * @returns {*} Returns Content of the service
     */
    function access(name) {
        const _this = this,
            accessedService = _this.chev[name];

        //Check if accessed service is registered
        if (accessedService) {
            //Call prepare with bound context
            return prepare(_this, accessedService).fn;
        }
    }

    /**
     * Creates typeList entry for service
     *
     * @private
     * @param {Object} _this The context
     * @returns Returns void
     */
    function initService(_this) {
        _this.extend(_service, function(service, bundle) {
            //Construct service
            const serviceFn = service.fn;

            service.fn = function() {
                //Chevron service function wrapper
                return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
            };

            return service;
        });
    }

    /**
     * Creates typeList entry for factory
     *
     * @private
     * @param {Object} _this The context
     * @returns Returns void
     */
    function initFactory(_this) {
        _this.extend(_factory, function(service, bundle) {
            //Construct factory

            //First value gets ignored by calling new like this, so we need to fill it
            bundle.unshift(null);

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
    let Chevron = function(id) {
        const _this = this;

        //Instance Id
        _this.id = id || "cv";
        //Instance transformerList
        _this.tl = {};
        //Instance container
        _this.chev = {};

        //Init default types
        initService(_this);
        initFactory(_this);
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

    return Chevron;

}));