(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('chevron', factory) :
    (global.Chevron = factory());
}(this, function () { 'use strict';

    //add new service/fn
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
    const _isUndefined=" is undefined";

    //Pushes new service/factory
    function provider(name, deps, type, fn, args) {
        let _this = this;

        if (_this.chev[name]) {
            throw `${_this.id}${_error}${type}: ${_service} '${name}' is already defined`;
        } else {
            add.apply(_this, arguments);

            return _this;
        }
    }

    //Create new service
    function service (name, deps, fn) {
        return this.provider(
            name,
            deps,
            _service,
            fn
        );
    }

    //Create new factory
    function factory (name, deps, Constructor, args) {
        return this.provider(
            name,
            deps,
            _factory,
            Constructor,
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

            this._each(keys, (key, i) => {
                fn(object[key], key, i);
            });
        }
    };

    //Initialized service and sets init to true
    function initialize (service, bundle) {
        if (service.type === _service) {
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

        util._eachObject(list, (item, key) => {
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
        util._each(dependencyList, name => {
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
                throw `${_this.id}${_error}${service.name}: dependency '${name}'${_isUndefined}`;
            }
        );

        return bundle(service, list);
    }

    //Returns prepared service
    function access(name) {
        let _this = this,
            accessedService = _this.chev[name];

        //Check if accessed service is registered
        if (accessedService) {
            return prepare.call(_this, accessedService).fn;
        } else {
            throw `${_this.id}${_error}${name}: '${name}'${_isUndefined}`;
        }
    }

    let Container = function (id) {
        let _this = this;

        _this.id = id || "cv";
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