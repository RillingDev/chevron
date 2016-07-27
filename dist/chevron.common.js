'use strict';

/**
 * Add a new service/factory to the container
 * @private
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @param Array (optional) factory arguments
 * @return void
 */
function add (name, deps, type, fn, args) {
    this.chev[name] = {
        name,
        type,
        deps,
        args: args || [],
        fn,
        init: false
    };
}

const _error = ": error in ";
const _factory = "factory";
const _service = "service";
const _isUndefined = " is undefined";

/**
 * Checks if service exist, else add it
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @return this
 */
function provider(name, deps, type, fn, args) {
    let _this = this;

    if (_this.chev[name]) {
        //throw error if a service with this name already exists
        throw `${_this.id}${_error}${type}: ${_service} '${name}' is already defined`;
    } else {
        //Call the add function with bound context
        add.apply(_this, arguments);

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
        name,
        deps,
        _service,
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
function factory (name, deps, Constructor, args) {
    return this.provider(
        name,
        deps,
        _factory,
        Constructor,
        args
    );
}

/**
 * Misc Utility functions
 */
var util = {
    /**
     * Iterate fn over array (faster than Array.prototype.forEach)
     * @private
     * @param Array values
     * @param Function iterate fn
     * @return void
     */
    _each: function (arr, fn) {
        for (let i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    },
    /**
     * Iterate fn over object
     * @private
     * @param Object values
     * @param Function iterate fn
     * @return void
     */
    _eachObject: function (object, fn) {
        let keys = Object.keys(object);

        this._each(keys, (key, i) => {
            fn(object[key], key, i);
        });
    }
};

/**
 * Initializes service/function
 * @private
 * @param Object service to check
 * @param Object bundle of dependencies
 * @return Object service
 */
function initialize (service, bundle) {
    if (service.type === _service) {
        //Construct service
        let serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
        };
    } else {
        //Construct factory
        bundle = bundle.concat(service.args);
        //first value gets ignored by calling new like this, so we need to fill it
        bundle.unshift(null);
        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));
    }

    service.init = true;
    return service;
}

/**
 * Collects dependencies and initializes service
 * @private
 * @param Object service to check
 * @param Object list of dependencies
 * @return Object service
 */
function bundle (service, list) {
    let bundle = [];

    if (!service.init) {
        //Collect dependencies for this service
        util._eachObject(list, (item, key) => {
            if (service.deps.includes(key)) {
                bundle.push(item);
            }
        });

        return initialize(service, bundle);
    } else {
        return service;
    }
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
    util._each(dependencyList, name => {
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
    let list = {};

    //Recurse trough service deps
    r.call(
        this,
        service.deps,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //make sure if dependency is initialized, then add
            list[dependency.name] = bundle(dependency, list).fn;
        },
        //error if dependency is missing
        name => {
            throw `${this.id}${_error}${service.name}: dependency '${name}'${_isUndefined}`;
        }
    );

    return bundle(service, list);
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
        throw `${_this.id}${_error}${name}: '${name}'${_isUndefined}`;
    }
}

/**
 * Basic Chevron Constructor
 * @constructor
 */
let Chevron = function (id) {
    this.id = id || "cv";
    this.chev = {};
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

module.exports = Chevron;