define(function () { 'use strict';

    function provider (name, dependencyList, fn, type, args) {
        let _this = this;

        if (_this.$c.exists(name)) {
            throw `${_this.name}: error in ${type}: service '${name}' is already defined`;
        } else {
            add(name, dependencyList, type, fn, args);

            return _this;
        }

        //add new service
        function add(name, dependencyList, type, fn, args) {
            let service = _this.container[name] = {
                name,
                type,
                dependencies: dependencyList || [],
                fn,
                initialized: false
            };
            //Add type specific props
            if (type === "factory") {
                service.args = args || [];
            }
        }
    }

    function service (name, dependencyList, fn) {
        return this.provider(
            name,
            dependencyList,
            fn,
            "service"
        );
    }

    function factory (name, dependencyList, Constructor, args) {
        return this.provider(
            name,
            dependencyList,
            Constructor,
            "factory",
            args
        );
    }

    var util = {
        //Iterate
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

    function access (name) {
        let _this = this;

        //Check if accessed service is registered
        if (_this.$c.exists(name)) {
            return prepare(_this.$c.get(name)).fn;
        } else {
            throw `${_this.name}: error accessing ${name}: '${name}' is not defined`;
        }

        function prepare(service) {
            let list = {};

            recurseDependencies(
                service.dependencies,
                dependency => {
                    list[dependency.name] = bundle(dependency, list).fn;
                },
                name => {
                    throw `${_this.name}: error in ${service.name}: dependency '${name}' is missing`;
                }
            );

            return bundle(service, list);
        }
        //Iterate deps
        function recurseDependencies(dependencyList, fn, error) {
            util.each(dependencyList, name => {
                if (_this.$c.exists(name)) {
                    let service = _this.$c.get(name);

                    if (service.dependencies.length > 0) {
                        //recurse
                        recurseDependencies(service.dependencies, fn, error);
                    }
                    fn(service);
                } else {
                    error(name);
                }
            });
        }

        function bundle(service, list) {
            let bundle = [];

            util.eachObject(list, (item, key) => {
                if (service.dependencies.includes(key)) {
                    bundle.push(item);
                }
            });

            if (!service.initialized) {
                return initialize(service, Array.from(bundle));
            } else {
                return service;
            }
        }

        //construct service/factory
        function initialize(service, bundle) {
            if (service.type === "service") {
                let serviceFn = service.fn;

                service.fn = function () {
                    //Chevron service function wrapper
                    return serviceFn.apply(null,
                        Array.from(bundle.concat(Array.from(arguments)))
                    );
                };
            } else {
                bundle = bundle.concat(service.args);
                bundle.unshift(null);
                //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
                service.fn = new(Function.prototype.bind.apply(service.fn, bundle));
            }

            service.initialized = true;
            return service;
        }
    }

    let Container = function (name) {
        let _this = this;

        _this.name = name || "cv";
        _this.container = {};

        /*####################/
        * Internal Chevron methods
        /####################*/
        _this.$c = {
            exists(name) {
                return typeof _this.$c.get(name) !== "undefined";
            },
            get(name) {
                return _this.container[name];
            },
        };
    };

    Container.prototype = {
        /*####################/
        * Main exposed methods
        /####################*/
        //Core service/factory method
        provider,
        //create new service
        service,
        //create new factory
        factory,
        //prepare/iialize services/factory with d injected
        access
    };

    return Container;

});