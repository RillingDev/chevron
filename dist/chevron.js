"use strict";

var Chevron = function () {
    'use strict';

    //strings

    var _strings = {
        s: "service",
        f: "factory",
        e: ": error in "
    };

    //add new service/fn
    function add(chev, name, dependencyList, type, fn, args) {
        var service = chev[name] = {
            name: name,
            type: type,
            deps: dependencyList || [],
            fn: fn,
            init: false
        };
        //Add type specific props
        if (type === _strings.f) {
            service.args = args || [];
        }
    }

    //Pushes new service/factory
    function provider(name, dependencyList, fn, type, args) {
        var _this = this;

        if (_this.chev[name]) {
            throw "" + _this.name + _strings.e + type + ": " + _strings.s + " '" + name + "' is already defined";
        } else {
            add(_this.chev, name, dependencyList, type, fn, args);

            return _this;
        }
    }

    //Create new service
    function service(name, dependencyList, fn) {
        return this.provider(name, dependencyList, fn, _strings.s);
    }

    //Create new factory
    function factory(name, dependencyList, Constructor, args) {
        return this.provider(name, dependencyList, Constructor, _strings.f, args);
    }

    //Utility functions
    var util = {
        each: function each(arr, fn) {
            for (var i = 0, l = arr.length; i < l; i++) {
                fn(arr[i], i);
            }
        },
        eachObject: function eachObject(object, fn) {
            var keys = Object.keys(object);

            for (var i = 0, l = keys.length; i < l; i++) {
                fn(object[keys[i]], keys[i], i);
            }
        }
    };

    //Initialized service and sets init to true
    function initialize(service, bundle) {
        if (service.type === _strings.s) {
            (function () {
                //Construct service
                var serviceFn = service.fn;

                service.fn = function () {
                    //Chevron service function wrapper
                    return serviceFn.apply(null, Array.from(bundle.concat(Array.from(arguments))));
                };
            })();
        } else {
            //Construct factory
            bundle = bundle.concat(service.args);
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();
        }

        service.init = true;
        return service;
    }

    //collect dependencies from string, and initialize them if needed
    function bundle(service, list) {
        var bundle = [];

        util.eachObject(list, function (item, key) {
            if (service.deps.indexOf(key) !== -1) {
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
        util.each(dependencyList, function (name) {
            var service = container[name];
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
    function prepare(service) {
        var _this = this,
            list = {};

        r(_this.chev, service.deps, function (dependency) {
            list[dependency.name] = bundle(dependency, list).fn;
        }, function (name) {
            throw "" + _this.name + _strings.e + service.name + ": dependency '" + name + "' missing";
        });

        return bundle(service, list);
    }

    //Returns prepared service
    function access(name) {
        var _this = this,
            accessedService = _this.chev[name];

        //Check if accessed service is registered
        if (accessedService) {
            return prepare.call(_this, accessedService).fn;
        } else {
            throw "" + _this.name + _strings.e + name + ": '" + name + "' is undefined";
        }
    }

    var Container = function Container(name) {
        var _this = this;

        _this.name = name || "cv";
        _this.chev = {};
    };

    Container.prototype = {
        //Core service/factory method
        provider: provider,
        //create new service
        service: service,
        //create new factory
        factory: factory,
        //prepare/iialize services/factory with deps injected
        access: access
    };

    return Container;
}();
//# sourceMappingURL=chevron.js.map
