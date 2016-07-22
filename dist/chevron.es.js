//add new service/fn
function add (chev, name, dependencyList, type, fn, args) {
    let service = chev[name] = {
        name,
        type,
        deps: dependencyList || [],
        fn,
        init: false
    };
    //Add type specific props
    if (type === "factory") {
        service.args = args || [];
    }
}

//Pushes new service/factory
function provider (name, dependencyList, fn, type, args) {
    let _this = this;

    if (_this.chev[name]) {
        throw `${_this.name}: error in ${type}: service '${name}' is already defined`;
    } else {
        add(_this.chev, name, dependencyList, type, fn, args);

        return _this;
    }
}

//Create new service
function service (name, dependencyList, fn) {
    return this.provider(
        name,
        dependencyList,
        fn,
        "service"
    );
}

//Create new factory
function factory (name, dependencyList, Constructor, args) {
    return this.provider(
        name,
        dependencyList,
        Constructor,
        "factory",
        args
    );
}

//Utility functions
var util = {
    each: function (arr, fn) {
        for (let i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    },
    eachObject: function (object, fn) {
        let keys = Object.keys(object);

        for (let i = 0, l = keys.length; i < l; i++) {
            fn(object[keys[i]], keys[i], i);
        }
    }
};

//Initialized service and sets init to true
function initialize (service, bundle) {
    if (service.type === "service") {
        //Construct service
        let serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null,
                Array.from(bundle.concat(Array.from(arguments)))
            );
        };
    } else {
        //Construct factory
        bundle = bundle.concat(service.args);
        bundle.unshift(null);
        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));
    }

    service.init = true;
    return service;
}

//collect dependencies from string, and initialize them if needed
function bundle (service, list) {
    let bundle = [];

    util.eachObject(list, (item, key) => {
        if (service.deps.includes(key)) {
            bundle.push(item);
        }
    });

    if (!service.init) {
        return initialize(service, Array.from(bundle));
    } else {
        return service;
    }

}

//Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
function r(container, dependencyList, fn, error) {
    util.each(dependencyList, name => {
        let service = container[name];
        if (service) {

            if (service.deps.length > 0) {
                //recurse
                r(container, service.deps, fn, error);
            }
            fn(service);
        } else {
            error(name);
        }
    });
}

//Main access function; makes sure that every service need is available
function prepare (service) {
    let _this = this,
        list = {};

    r(
        _this.chev,
        service.deps,
        dependency => {
            list[dependency.name] = bundle(dependency, list).fn;
        },
        name => {
            throw `${_this.name}: error in ${service.name}: dependency '${name}' is missing`;
        }
    );

    return bundle(service, list);
}

//Returns prepared service
function access (name) {
    let _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        return prepare.call(_this, accessedService).fn;
    } else {
        throw `${_this.name}: error accessing ${name}: '${name}' is not defined`;
    }

}

let Container = function (name) {
    let _this = this;

    _this.name = name || "cv";
    _this.chev = {};

};

Container.prototype = {
    //Core service/factory method
    provider,
    //create new service
    service,
    //create new factory
    factory,
    //prepare/iialize services/factory with deps injected
    access
};

export default Container;