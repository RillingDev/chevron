/*
chevronjs v1.0.0-rc2

Copyright (c) 2016 Felix Rilling

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

(function (window) {

    class Chevron {
        constructor(name = "Chevron") {
                let _this = this;

                _this.options = {
                    name
                };
                _this.container = {};
                /* <!-- comments:toggle // --> */
                _this.injects = {
                    middleware: [],
                    decorator: []
                };
                /* <!-- endcomments --> */

                /*####################/
                * Internal Chevron methods
                /####################*/
                _this.$c = {
                    //add new service
                    add(name, dependencyList, type, content, args) {
                        let service = _this.container[name] = {
                            dependencies: dependencyList || [],
                            type,
                            content,
                            initialized: false,
                            name
                        };
                        //Add type specific props
                        if (type === "factory") {
                            service.args = args || [];
                            service.args.shift();
                        }
                    },
                    //Check initialized status/dependencies and issues initialize
                    prepare(service) {
                        let result,
                            list = {};

                        _this.$c.fetchDependencies(
                            service.dependencies,
                            dependency => {
                                list[dependency.name] = _this.$c.bundle(dependency, list).content;
                            },
                            name => {
                                _this.$c.throwMissingDep(name);
                            }
                        );
                        result = _this.$c.bundle(service, list);

                        return result;
                    },
                    //Iterate dependencies
                    fetchDependencies(dependencyList, fn, error) {
                        _this.$u.each(dependencyList, name => {
                            if (_this.$c.exists(name)) {
                                let service = _this.$c.get(name);

                                if (_this.$c.hasDependencies(service)) {
                                    //recurse
                                    _this.$c.fetchDependencies(service.dependencies, fn, error);
                                }
                                fn(service);
                            } else {
                                error(name);
                            }
                        });
                    },
                    bundle(service, list) {
                        let result,
                            bundle = _this.$u.filterObject(list, (item, key) => {
                                return service.dependencies.includes(key);
                            });

                        if (!service.initialized) {
                            result = _this.$c.initialize(service, bundle);
                        } else {
                            result = service;
                        }

                        return result;
                    },

                    //construct service/factory
                    initialize(service, bundle) {
                        /* <!-- comments:toggle // --> */
                        service = _this.$c.execDecorator(service, bundle);
                        /* <!-- endcomments --> */

                        if (_this.$c.hasType(service, "service")) {
                            let serviceFn = service.content;

                            service.content = function () {
                                //CHevron service function wrapper
                                /* <!-- comments:toggle // --> */
                                _this.$c.execMiddleware(service, bundle);
                                /* <!-- endcomments --> */
                                return serviceFn.apply(bundle, arguments);
                            };
                        } else if (_this.$c.hasType(service, "factory")) {
                            let container = Object.create(service.prototype || Object.prototype);

                            _this.$u.eachObject(bundle, (dependency, name) => {
                                container[name] = dependency;
                            });

                            service.content = (service.content.apply(container, service.args) || container);
                        }

                        service.initialized = true;
                        return service;
                    },
                    /* <!-- comments:toggle // --> */
                    execMiddleware(service, bundle) {
                        _this.$c.execInject("middleware", service, inject => {
                            inject.fn.call(bundle, service);
                        });
                    },
                    execDecorator(service, bundle) {
                        _this.$c.execInject("decorator", service, inject => {
                            service.content = inject.fn.call(bundle, service.content);
                        });

                        return service;
                    },
                    execInject(type, service, fn) {
                        _this.$u.each(_this.injects[type], inject => {
                            if (_this.$c.injectorApplies(service.name, inject)) {
                                fn(inject);
                            }
                        });
                    },
                    injectorApplies(name, inject) {
                        return inject.applies.length === 0 ? true : inject.applies.includes(name);
                    },
                    /* <!-- endcomments --> */
                    exists(name) {
                        return _this.$u.isDefined(_this.container[name]);
                    },
                    get(name) {
                        return _this.container[name];
                    },
                    hasType(service, type) {
                        return service.type === type;
                    },
                    hasDependencies(service) {
                        return service.dependencies.length > 0;
                    },
                    //throws errors
                    throwMissingDep(name, type, missing) {
                        _this.$u.log(
                            name,
                            "error",
                            type,
                            `dependency '${missing}' not found`
                        );
                    },
                    throwNotFound(name) {
                        _this.$u.log(
                            name,
                            "error",
                            "type",
                            `service '${name}' not found`
                        );
                    },
                    throwDupe(name, type) {
                        _this.$u.log(
                            name,
                            "error",
                            type,
                            `service '${name}' is already defined`
                        );
                    },
                };
                /*####################/
                * Internal Utility methods
                /####################*/
                _this.$u= {
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
                    },
                    filterObject(obj, fn) {
                        let result = {};

                        _this.$u.eachObject(obj, (item, key, index) => {
                            if (fn(item, key, index)) {
                                result[key] = item;
                            }
                        });

                        return result;
                    },
                    //return if val is defined
                    isDefined(val) {
                        return typeof val !== "undefined";
                    },
                    //log
                    log(name, type, element, msg) {
                        let str = `${_this.options.name} ${type} in ${element} '${name}': ${msg}`;
                        if (type === "error") {
                            throw str;
                        } else {
                            console.log(str);
                        }
                    }
                };

            }
            /*####################/
            * Main exposed methods
            /####################*/
            //Core service/factory method
        provider(name, dependencyList, content, type, args) {
                let _this = this;

                if (!_this.$c.exists(name)) {
                    _this.$c.add(name, dependencyList, type, content, args);
                } else {
                    _this.$c.throwDupe(name, type);
                }

                return _this;
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
                args.unshift(null);
                return this.provider(
                    name,
                    dependencyList,
                    Constructor,
                    "factory",
                    args
                );
            }
            /* <!-- comments:toggle // --> */
            /*Core decorator/middleware method*/
        injector(type, fn, applies) {
                let _this = this;

                _this.injects[type].push({
                    fn,
                    applies: applies || []
                });

                return _this;
            }
            /*Injects a decorator to a service/factory*/
        decorator(fn, applies) {
                return this.injector("decorator", fn, applies);
            }
            /*Injects a middleware to a service*/
        middleware(fn, applies) {
                return this.injector("middleware", fn, applies);
            }
            /* <!-- endcomments --> */
            //prepare/initialize services/factory with dependencies injected
        access(name) {
                let _this = this;

                //Check if accessed service is registered
                if (_this.$c.exists(name)) {
                    return _this.$c.prepare(_this.$c.get(name)).content;
                } else {
                    _this.$c.throwNotFound(name);
                }

            }
            //returns service container
        list() {
            return this.container;
        }
    }

    window.Chevron = Chevron;
})(window);
