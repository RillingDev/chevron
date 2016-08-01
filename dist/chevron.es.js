const _more = ": ";
const _factory = "factory";
const _service = "service";
const _isUndefined = " is undefined";
const _errorStart = function (_this) {
        return _this.id + _more + "error in ";
    };

/**
 * Checks if service exist, else add it
 * @param String name to register/id the service
 * @param Array list of dependencies
 * @param String type of service (service/factory)
 * @param Function content of the service
 * @return Chevron instance
 */
function provider(type, name, deps, fn) {
    const _this = this;

    if (_this.chev[name]) {
        //throw error if a service with this name already exists
        throw _errorStart(_this) + name + " already exists";
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
function extend (type, transformer) {
    const _this = this;

    _this.tl[type] = transformer;
    _this[type] = function (name, deps, fn) {
        return _this.provider(type, name, deps, fn);
    };

    return _this;
}

/**
 * Collects dependencies and initializes service
 * @private
 * @param Object context
 * @param Object service to check
 * @param Object list of dependencies
 * @return Object service
 */
function initialize (_this, service, list) {
    let bundle = [];

    if (!service.init) {
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
 * Loops/recurses over list of dependencies
 * @private
 * @param Object context
 * @param Array dependencyList to iterate
 * @param Function to run over each dependency
 * @return void
 */
//Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
function r(_this, service, fn) {
    //loop trough deps
    service.deps.forEach(name => {
        const dependency = _this.chev[name];

        if (dependency) {
            //recurse over sub-deps
            r(_this, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if not found error with name
            throw _errorStart(_this) + service.name + _more + "dependency " + name + _isUndefined;
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
    const list = {};

    //Recurse trough service deps
    r(
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
 * @param String name of the service
 * @return Function with dependencies bound
 */
function access (name) {
    const _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        //Call prepare with bound context
        return prepare(_this, accessedService).fn;
    } else {
        //throw error if service does not exist
        throw _errorStart(_this) + name + _more + name + _isUndefined;
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
        const serviceFn = service.fn;

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

export default Chevron;