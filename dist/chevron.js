(function (exports) {
    'use strict';

    let $c = {
        //add new service
        add(name, dependencyList, type, fn, args) {
            let service = this.container[name] = {
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
        },
        //Check i status/d and issues iialize
        prepare(service) {
            let list = {};

            this.recurseDependencies(
                service.dependencies,
                dependency => {
                    list[dependency.name] = this.bundle(dependency, list).fn;
                },
                name => {
                    throw `${this.name}: error in ${service.name}: dependency '${name}' is missing`;
                }
            );

            return this.bundle(service, list);
        },
        //Iterate deps
        recurseDependencies(dependencyList, fn, error) {
            this.$u.each(dependencyList, name => {
                if (this.$c.exists(name)) {
                    let service = this.$c.get(name);

                    if (service.dependencies.length > 0) {
                        //recurse
                        this.$c.recurseDependencies(service.dependencies, fn, error);
                    }
                    fn(service);
                } else {
                    error(name);
                }
            });
        },
        bundle(service, list) {
            let bundle = [];

            _this.$u.eachObject(list, (item, key) => {
                if (service.dependencies.includes(key)) {
                    bundle.push(item);
                }
            });

            if (!service.initialized) {
                return _this.$c.initialize(service, Array.from(bundle));
            } else {
                return service;
            }
        },

        //construct service/factory
        initialize(service, bundle) {
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
        },
        exists(name) {
            return typeof this.$c.get(name) !== "undefined";
        },
        get(name) {
            return this.container[name];
        },
    };

    class Container {
        constructor(name) {
                let _this = this;
                //_this.aaa = foo;
                _this.name = name || "cv";

                _this.container = {};

                /*####################/
                * Internal Chevron methods
                /####################*/
                _this.$c = $c;
                /*####################/
                * Internal Utility methods
                /####################*/
                _this.$u = {
                    //Iterate
                    each(arr, fn) {
                        for (let i = 0, l = arr.length; i < l; i++) {
                            fn(arr[i], i);
                        }
                    },
                    eachObject(object, fn) {
                        let keys = Object.keys(object);

                        for (let i = 0, l = keys.length; i < l; i++) {
                            fn(object[keys[i]], keys[i], i);
                        }
                    }
                };
            }
            /*####################/
            * Main exposed methods
            /####################*/
            //Core service/factory method
        provider(name, dependencyList, fn, type, args) {
                let _this = this;

                if (_this.$c.exists(name)) {
                    throw `${_this.name}: error in ${type}: service '${name}' is already defined`;
                } else {
                    _this.$c.add(name, dependencyList, type, fn, args);

                    return _this;
                }
            }
            //create new service
        service(name, dependencyList, fn) {
                return this.provider(
                    name,
                    dependencyList,
                    fn,
                    "service"
                );
            }
            //create new factory
        factory(name, dependencyList, Constructor, args) {
                return this.provider(
                    name,
                    dependencyList,
                    Constructor,
                    "factory",
                    args
                );
            }
            //prepare/iialize services/factory with d injected
        access(name) {
            let _this = this;

            //Check if accessed service is registered
            if (_this.$c.exists(name)) {
                return _this.$c.prepare(_this.$c.get(name)).fn;
            } else {
                throw `${_this.name}: error accessing ${name}: '${name}' is not defined`;
            }

        }
    }

    exports.Container = Container;

}((this.chevron = this.chevron || {})));