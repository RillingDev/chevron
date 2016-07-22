"use strict";

var Chevron = function () {
    'use strict';

    function provider(name, dependencyList, fn, type, args) {
        var _this = this;

        if (_this.chev[name]) {
            throw _this.name + ": error in " + type + ": service '" + name + "' is already defined";
        } else {
            add(name, dependencyList, type, fn, args);

            return _this;
        }

        //add new service
        function add(name, dependencyList, type, fn, args) {
            var service = _this.chev[name] = {
                name: name,
                type: type,
                deps: dependencyList || [],
                fn: fn,
                init: false
            };
            //Add type specific props
            if (type === "factory") {
                service.args = args || [];
            }
        }
    }

    function service(name, dependencyList, fn) {
        return this.provider(name, dependencyList, fn, "service");
    }

    function factory(name, dependencyList, Constructor, args) {
        return this.provider(name, dependencyList, Constructor, "factory", args);
    }

    var util = {
        //Iterate
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

    function initialize(service, bundle) {
        if (service.type === "service") {
            (function () {
                var serviceFn = service.fn;

                service.fn = function () {
                    //Chevron service function wrapper
                    return serviceFn.apply(null, Array.from(bundle.concat(Array.from(arguments))));
                };
            })();
        } else {
            bundle = bundle.concat(service.args);
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();
        }

        service.init = true;
        return service;
    }

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

    //Iterate deps
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

    function prepare(chev, service) {
        var list = {};

        r(chev, service.deps, function (dependency) {
            list[dependency.name] = bundle(dependency, list).fn;
        }, function (name) {
            throw _this.name + ": error in " + service.name + ": dependency '" + name + "' is missing";
        });

        return bundle(service, list);
    }

    function access(name) {
        var _this = this,
            accessedService = _this.chev[name];

        //Check if accessed service is registered
        if (accessedService) {
            return prepare(_this.chev, accessedService).fn;
        } else {
            throw _this.name + ": error accessing " + name + ": '" + name + "' is not defined";
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
