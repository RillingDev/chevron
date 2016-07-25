define('chevron', function () { 'use strict';

    //strings
    var _strings = {
        s: "service",
        f: "factory",
        e: ": error in "
    };

    //add new service/fn
    function add (chev, n, dependencyList, t, f, args) {
        let service = chev[n] = {
            n,
            t,
            d: dependencyList || [],
            f,
            i: false
        };
        //Add type specific props
        if (t === _strings.f) {
            service.a = args || [];
        }
    }

    //Pushes new service/factory
    function provider (name, dependencyList, fn, type, args) {
        let _this = this;

        if (_this.chev[name]) {
            throw `${_this.n}${_strings.e}${type}: ${_strings.s} '${name}' is already defined`;
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
            _strings.s
        );
    }

    //Create new factory
    function factory (name, dependencyList, Constructor, args) {
        return this.provider(
            name,
            dependencyList,
            Constructor,
            _strings.f,
            args
        );
    }

    //Utility functions
    var util = {
        e: function (arr, fn) {
            for (let i = 0, l = arr.length; i < l; i++) {
                fn(arr[i], i);
            }
        },
        o: function (object, fn) {
            let keys = Object.keys(object);

            for (let i = 0, l = keys.length; i < l; i++) {
                fn(object[keys[i]], keys[i], i);
            }
        }
    };

    //Initialized service and sets init to true
    function initialize (service, bundle) {
        if (service.t === _strings.s) {
            //Construct service
            let serviceFn = service.f;

            service.f = function () {
                //Chevron service function wrapper
                return serviceFn.apply(null,
                    Array.from(bundle.concat(Array.from(arguments)))
                );
            };
        } else {
            //Construct factory
            bundle = bundle.concat(service.a);
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service.f = new(Function.prototype.bind.apply(service.f, bundle));
        }

        service.i = true;
        return service;
    }

    //collect dependencies from string, and initialize them if needed
    function bundle (service, list) {
        let bundle = [];

        util.o(list, (item, key) => {
            if (service.d.includes(key)) {
                bundle.push(item);
            }
        });

        if (!service.i) {
            return initialize(service, Array.from(bundle));
        } else {
            return service;
        }

    }

    //Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
    function r(container, dependencyList, fn, error) {
        util.e(dependencyList, name => {
            let service = container[name];
            if (service) {

                if (service.d.length > 0) {
                    //recurse
                    r(container, service.d, fn, error);
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
            service.d,
            dependency => {
                list[dependency.n] = bundle(dependency, list).f;
            },
            name => {
                throw `${_this.n}${_strings.e}${service.n}: dependency '${name}' missing`;
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
            return prepare.call(_this, accessedService).f;
        } else {
            throw `${_this.n}${_strings.e}${name}: '${name}' is undefined`;
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

});