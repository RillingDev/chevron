define('chevron', function () { 'use strict';

    const _more = ": ";
    const _factory = "factory";
    const _service = "service";
    const _error = _more + "error in ";
    const _isUndefined = " is undefined";

    /**
     * Checks if service exist, else add it
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @return Chevron instance
     */
    function provider (type, name, deps, fn) {
        let _this = this;

        if (_this.chev[name]) {
            //throw error if a service with this name already exists
            throw _this.id + _error + type + _more + _service + " '" + name + "' already defined";
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
     * @param String name of the type
     * @param fn to call when the service is constructed
     * @return Chevron instance
     */
    function extend (type, fn) {
        let _this = this;

        _this.tl[type] = fn;
        _this[type] = function (name, deps, fn) {
            return _this.provider(type, name, deps, fn);
        }

        return _this;
    }

    /**
     * Misc Utility functions
     */
    let _each = function(arr, fn) {
        for (let i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    };
    /**
     * Iterate fn over object
     * @private
     * @param Object values
     * @param Function iterate fn
     * @return void
     */
    /*_eachObject = function (object, fn) {
            let keys = Object.keys(object);

            _each(keys, (key, i) => {
                fn(object[key], key, i);
            });
    };*/

    /**
     * Collects dependencies and initializes service
     * @private
     * @param Object context
     * @param Object service to check
     * @param Object list of dependencies
     * @return Object service
     */
    function initialize(_this, service, list) {
        let bundle = [];

        if (!service.init) {
            _each(service.deps, item => {
                let dep = list[item];

                if (dep) {
                    bundle.push(dep);
                }
            });

            //Init service
            service = _this.tl[service.type](service, bundle.map(item => {
                return item.fn;
            }));
            service.init = true;
        }

        return service;
    }

    /**
     * Loops/recurses over list of dependencies
     * @private
     * @param Object context
     * @param Array dependencyList to iterate
     * @param Function to run over each dependency
     * @param Function to call on error
     * @return void
     */
    //Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
    function r(_this, dependencyList, fn, error) {
        _each(dependencyList, name => {
            let service = _this.chev[name];

            if (service) {
                //recurse if service has dependencies too
                if (service.deps.length > 0) {
                    //recurse
                    r(_this, service.deps, fn, error);
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
     * @param Object context
     * @param Object service to check
     * @return bound service
     */
    function prepare (_this, service) {
        let list = {};

        //Recurse trough service deps
        r(
            _this,
            service.deps,
            //run this over every dependency to add it to the dependencyList
            dependency => {
                //make sure if dependency is initialized, then add
                list[dependency.name] = initialize(_this, dependency, list);
            },
            //error if dependency is missing
            name => {
                throw _this.id + _error + service.name + _more + "dependency " + name + _isUndefined;
            }
        );

        return initialize(_this, service, list);
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
            return prepare(_this, accessedService).fn;
        } else {
            //throw error if service does not exist
            throw _this.id + _error + name + _more + name + _isUndefined;
        }
    }

    /**
     * Creates typeList entry for service
     * @private
     * @param Object context
     * @return void
     */
    function initService (_this) {

        _this.extend(_service, function (service, bundle) {
            //Construct service
            let serviceFn = service.fn;

            service.fn = function () {
                //Chevron service function wrapper
                return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
            };

            return service;
        });
    }

    /**
     * Creates typeList entry for factory
     * @private
     * @param Object context
     * @return void
     */
    function initFactory (_this) {
        _this.extend(_factory, function (service, bundle) {
            //Construct factory
            //first value gets ignored by calling new like this, so we need to fill it
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

            return service;
        });
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
        _this.tl = {};

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

});