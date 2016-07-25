"use strict";

var Chevron = function () {
    'use strict';

    //add new service/fn

    function add(_name, _deps, _type, _fn, _args) {
        //External applications should not try to access container props as the keys change between min/normal version; stick to cv.access()
        this.chev[_name] = {
            _name: _name,
            _type: _type,
            _deps: _deps,
            _args: _args || [],
            _fn: _fn,
            _init: false
        };
    }

    //strings
    var _error = ": error in ";

    //strings
    var _service = "service";

    //Pushes new service/factory
    function provider(_name, _deps, _type, _fn, _args) {
        var _this = this;

        if (_this.chev[_name]) {
            throw "" + _this.n + _error + _type + ": " + _service + " '" + _name + "' is already defined";
        } else {
            add.apply(_this, arguments);

            return _this;
        }
    }

    //Create new service
    function service(_name, _deps, _fn) {
        return this.provider(_name, _deps, _service, _fn);
    }

    //strings
    var _factory = "factory";

    //Create new factory
    function factory(_name, _deps, _Constructor, _args) {
        return this.provider(_name, _deps, _factory, _Constructor, _args);
    }

    //Utility functions
    var util = {
        _each: function _each(arr, fn) {
            for (var i = 0, l = arr.length; i < l; i++) {
                fn(arr[i], i);
            }
        },
        _eachObject: function _eachObject(object, fn) {
            var keys = Object.keys(object);

            this._each(keys, function (key, i) {
                fn(object[key], key, i);
            });
        }
    };

    //Initialized service and sets init to true
    function initialize(service, bundle) {
        if (service._type === _service) {
            (function () {
                //Construct service
                var serviceFn = service._fn;

                service._fn = function () {
                    //Chevron service function wrapper
                    return serviceFn.apply(null, Array.from(bundle.concat(Array.from(arguments))));
                };
            })();
        } else {
            //Construct factory
            bundle = bundle.concat(service._args);
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service._fn = new (Function.prototype.bind.apply(service._fn, bundle))();
        }

        service._init = true;
        return service;
    }

    //collect dependencies from string, and initialize them if needed
    function bundle(service, list) {
        var bundle = [];

        util._eachObject(list, function (item, key) {
            if (service._deps.indexOf(key) !== -1) {
                bundle.push(item);
            }
        });

        if (!service._init) {
            return initialize(service, Array.from(bundle));
        } else {
            return service;
        }
    }

    //Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
    function r(container, dependencyList, fn, error) {
        util._each(dependencyList, function (name) {
            var service = container[name];
            if (service) {

                if (service._deps.length > 0) {
                    //recurse
                    r(container, service._deps, fn, error);
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

        r(_this.chev, service._deps, function (dependency) {
            list[dependency._name] = bundle(dependency, list)._fn;
        }, function (name) {
            throw "" + _this.n + _error + service._name + ": dependency '" + name + "' missing";
        });

        return bundle(service, list);
    }

    //Returns prepared service
    function access(name) {
        var _this = this,
            accessedService = _this.chev[name];

        //Check if accessed service is registered
        if (accessedService) {
            return prepare.call(_this, accessedService)._fn;
        } else {
            throw "" + _this.n + _error + name + ": '" + name + "' is undefined";
        }
    }

    var Container = function Container(name) {
        var _this = this;

        _this.n = name || "cv";
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
