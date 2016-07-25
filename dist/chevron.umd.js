(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('chevron', factory) :
    (global.Chevron = factory());
}(this, function () { 'use strict';

    //add new service/fn
    function add (chev, _name, dependencyList, _type, _fn, _args) {
        //External applications should not try to access container props as the keys change between min/normal version; stick to cv.access()
        let service = chev[_name] = {
            _name,
            _type,
            _deps: dependencyList || [],
            _args,
            _fn,
            _init: false
        };
    }

    //strings
    var _error = ": error in ";

    //strings
    var _service = ": error in ";

    //Pushes new service/factory
    function provider (name, dependencyList, fn, type, args) {
        let _this = this;

        if (_this.chev[name]) {
            throw `${_this.n}${_error}${type}: ${_service} '${name}' is already defined`;
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
            _service
        );
    }

    //strings
    var _factory = "factory";

    //Create new factory
    function factory (name, dependencyList, Constructor, args) {
        return this.provider(
            name,
            dependencyList,
            Constructor,
            _factory,
            args
        );
    }

    //Utility functions
    var util = {
        _each: function (arr, fn) {
            for (let i = 0, l = arr.length; i < l; i++) {
                fn(arr[i], i);
            }
        },
        _eachObject: function (object, fn) {
            let keys = Object.keys(object);

            for (let i = 0, l = keys.length; i < l; i++) {
                fn(object[keys[i]], keys[i], i);
            }
        }
    };

    //Initialized service and sets init to true
    function initialize (service, bundle) {
        if (service._type === _service) {
            //Construct service
            let serviceFn = service._fn;

            service._fn = function () {
                //Chevron service function wrapper
                return serviceFn.apply(null,
                    Array.from(bundle.concat(Array.from(arguments)))
                );
            };
        } else {
            //Construct factory
            bundle = bundle.concat(service._args);
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service._fn = new(Function.prototype.bind.apply(service._fn, bundle));
        }

        service._init = true;
        return service;
    }

    //collect dependencies from string, and initialize them if needed
    function bundle (service, list) {
        let bundle = [];

        util._eachObject(list, (item, key) => {
            if (service._deps.includes(key)) {
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
        util._each(dependencyList, name => {
            let service = container[name];
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
    function prepare (service) {
        let _this = this,
            list = {};

        r(
            _this.chev,
            service._deps,
            dependency => {
                list[dependency._name] = bundle(dependency, list)._fn;
            },
            name => {
                throw `${_this.n}${_error}${service._name}: dependency '${name}' missing`;
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
            return prepare.call(_this, accessedService)._fn;
        } else {
            throw `${_this.n}${_error}${name}: '${name}' is undefined`;
        }

    }

    let Container = function (name) {
        let _this = this;

        _this.n = name || "cv";
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

    return Container;

}));