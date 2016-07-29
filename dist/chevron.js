"use strict";

var Chevron = function () {
    'use strict';

    var _part1 = ": ";
    var _factory = "factory";
    var _service = "service";
    var _error = _part1 + "error in ";
    var _isUndefined = " is undefined";

    /**
     * Checks if service exist, else add it
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @return Chevron instance
     */
    function provider(type, name, deps, fn) {
        var _this = this;

        if (_this.chev[name]) {
            //throw error if a service with this name already exists
            throw "" + _this.id + _error + type + _part1 + _service + " '" + name + "' is already defined";
        } else {
            //Add the service to container
            _this.chev[name] = {
                type: type,
                name: name,
                deps: deps,
                fn: fn,
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
    function extend(type, fn) {
        var _this = this;

        _this.tl[type] = fn;
        _this[type] = function (name, deps, fn) {
            return _this.provider(type, name, deps, fn);
        };

        return _this;
    }

    var _each = function _each(arr, fn) {
        for (var i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    };
    var _eachObject = function _eachObject(object, fn) {
        var keys = Object.keys(object);

        _each(keys, function (key, i) {
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
    function initialize(service, list) {
        var bundle = [];

        if (!service.init) {
            //Collect dependencies for this service
            _eachObject(list, function (item, key) {
                if (service.deps.indexOf(key) !== -1) {
                    bundle.push(item);
                }
            });

            //Init service
            service = this.tl[service.type](service, bundle);
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
        var _this2 = this;

        _each(dependencyList, function (name) {
            var service = _this2.chev[name];

            if (service) {
                //recurse if service has dependencies too
                if (service.deps.length > 0) {
                    //recurse
                    r.call(_this2, service.deps, fn, error);
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
    function prepare(service) {
        var _this = this,
            list = {};

        //Recurse trough service deps
        r.call(_this, service.deps,
        //run this over every dependency to add it to the dependencyList
        function (dependency) {
            //make sure if dependency is initialized, then add
            list[dependency.name] = initialize.call(_this, dependency, list).fn;
        },
        //error if dependency is missing
        function (name) {
            throw "" + _this.id + _error + service.name + _part1 + "dependency '" + name + "'" + _isUndefined;
        });

        return initialize.call(_this, service, list);
    }

    /**
     * Access service with dependencies bound
     * @param String name of the service
     * @return Function with dependencies bound
     */
    function access(name) {
        var _this = this,
            accessedService = _this.chev[name];

        //Check if accessed service is registered
        if (accessedService) {
            //Call prepare with bound context
            return prepare.call(_this, accessedService).fn;
        } else {
            //throw error if service does not exist
            throw "" + _this.id + _error + name + _part1 + "'" + name + "'" + _isUndefined;
        }
    }

    /**
     * Create a new service
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @return Chevron instance
     */
    function initService(_this) {
        console.log(_this);

        _this.extend(_service, function (service, bundle) {
            //Construct service
            var serviceFn = service.fn;

            service.fn = function () {
                //Chevron service function wrapper
                return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
            };

            return service;
        });
    }

    /**
     * Create a new factory
     * @param String name to register/id the service
     * @param Array list of dependencies
     * @param String type of service (service/factory)
     * @param Function content of the service
     * @return Chevron instance
     */
    function initFactory(_this) {
        _this.extend(_factory, function (service, bundle) {
            //Construct factory
            //first value gets ignored by calling new like this, so we need to fill it
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();

            return service;
        });
    }

    /**
     * Basic Chevron Constructor
     * @constructor
     * @param String to id the container
     */
    var Chevron = function Chevron(id) {
        var _this = this;

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
        provider: provider,
        //Prepare/init services/factory with deps injected
        access: access,
        //Add new service type
        extend: extend
    };

    return Chevron;
}();
//# sourceMappingURL=chevron.js.map
