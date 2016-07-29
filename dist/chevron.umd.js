(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('chevron', factory) :
    (global.Chevron = factory());
}(this, function () { 'use strict';

    const _part1 = ": ";
    const _factory = "factory";
    const _service = "service";
    const _error = _part1 + "error in ";
    const _isUndefined = " is undefined";

    /**
     * Checks if service exist, else add it
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @return this
     */
    function provider (type, name, deps, fn) {
        let _this = this;

        if (_this.chev[name]) {
            //throw error if a service with this name already exists
            throw `${_this.id}${_error}${type}${_part1}${_service} '${name}' is already defined`;
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
     * Create a new service
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @return this
     */
    function service (name, deps, fn) {
        return this.provider(
            _service,
            name,
            deps,
            fn
        );
    }

    /**
     * Create a new factory
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @param Array factory arguments
     * @return this
     */
    function factory (name, deps, Constructor) {
        return this.provider(
            _factory,
            name,
            deps,
            Constructor
        );
    }

    let _each = function (arr, fn) {
            for (let i = 0, l = arr.length; i < l; i++) {
                fn(arr[i], i);
            }
        };
    let _eachObject = function (object, fn) {
            let keys = Object.keys(object);

            _each(keys, (key, i) => {
                fn(object[key], key, i);
            });
        };

    /**
     * Collects dependencies and initializes service
     * @private
     * @param Object service to check
     * @param Object list of dependencies
     * @return Object service
     */
    function initialize (service, list) {
        let bundle = [];

        if (!service.init) {
            //Collect dependencies for this service
            _eachObject(list, (item, key) => {
                if (service.deps.includes(key)) {
                    bundle.push(item);
                }
            });

            //Init service
            service = this.tf[service.type](service, bundle);
            service.init = true;
        }

        return service;
    }

    /**
     * Loops/recurses over list of dependencies
     * @private
     * @param Array dependencyList to iterate
     * @param Function to run over each dependency
     * @param Function to call on error
     * @return void
     */
    //Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
    function r(dependencyList, fn, error) {
        _each(dependencyList, name => {
            let service = this.chev[name];

            if (service) {
                //recurse if service has dependencies too
                if (service.deps.length > 0) {
                    //recurse
                    r.call(this, service.deps, fn, error);
                }
                //run fn
                fn(service);
            } else {
                //if not found error with name
                error(name);
            }
        });
    }

    /**
     * Check if every dependency is available
     * @private
     * @param Object service to check
     * @return bound service
     */
    function prepare (service) {
        let _this = this,
            list = {};

        //Recurse trough service deps
        r.call(
            _this,
            service.deps,
            //run this over every dependency to add it to the dependencyList
            dependency => {
                //make sure if dependency is initialized, then add
                list[dependency.name] = initialize.call(_this, dependency, list).fn;
            },
            //error if dependency is missing
            name => {
                throw `${_this.id}${_error}${service.name}${_part1}dependency '${name}'${_isUndefined}`;
            }
        );

        return initialize.call(_this, service, list);
    }

    /**
     * Access service with dependencies bound
     * @param String name of the service
     * @return Function with dependencies bound
     */
    function access (name) {
        let _this = this,
            accessedService = _this.chev[name];

        //Check if accessed service is registered
        if (accessedService) {
            //Call prepare with bound context
            return prepare.call(_this, accessedService).fn;
        } else {
            //throw error if service does not exist
            throw `${_this.id}${_error}${name}${_part1}'${name}'${_isUndefined}`;
        }
    }

    function initService (service, bundle) {
        //Construct service
        let serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
        };

        return service;
    }

    function initFactory (service, bundle) {
        //first value gets ignored by calling new like this, so we need to fill it
        bundle.unshift(null);
        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

        return service;
    }

    /**
     * Basic Chevron Constructor
     * @constructor
     * @param String to id the container
     */
    let Chevron = function (id) {
        let _this = this;

        _this.id = id || "cv";
        _this.chev = {};
        _this.tf = {
            service: initService,
            factory: initFactory
        };
    };

    /**
     * Expose Chevron methods
     */
    Chevron.prototype = {
        //Core service/factory method
        provider,
        //Create new service
        service,
        //Create new factory
        factory,
        //Prepare/init services/factory with deps injected
        access
    };

    return Chevron;

}));