/*
chevronjs v1.2.1

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    var Chevron = function () {
        function Chevron() {
            var name = arguments.length <= 0 || arguments[0] === undefined ? "cv" : arguments[0];

            _classCallCheck(this, Chevron);

            var _this = this;

            _this.name = name;

            _this.container = {};

            //    _this.injects = {
            //    middleware: [],
            //    decorator: []
            //    };

            /*####################/
            * Internal Chevron methods
            /####################*/
            _this.$c = {
                //add new service

                add: function add(name, dependencyList, type, content, args) {
                    var service = _this.container[name] = {
                        name: name,
                        type: type,
                        dependencies: dependencyList || [],
                        content: content,
                        initialized: false
                    };
                    //Add type specific props
                    if (type === "factory") {
                        service.args = args || [];
                    }
                },

                //Check initialized status/dependencies and issues initialize
                prepare: function prepare(service) {
                    var list = {};

                    _this.$c.fetchDependencies(service.dependencies, function (dependency) {
                        list[dependency.name] = _this.$c.bundle(dependency, list).content;
                    }, function (name) {
                        throw _this.name + ": error in " + service.name + ": dependency '" + name + "' is missing";
                    });

                    return _this.$c.bundle(service, list);
                },

                //Iterate dependencies
                fetchDependencies: function fetchDependencies(dependencyList, fn, error) {
                    _this.$u.each(dependencyList, function (name) {
                        if (_this.$c.exists(name)) {
                            var service = _this.$c.get(name);

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
                bundle: function bundle(service, list) {
                    var bundle = [];

                    _this.$u.eachObject(list, function (item, key) {
                        if (service.dependencies.indexOf(key) !== -1) {
                            bundle.push(item);
                        }
                    });

                    if (!service.initialized) {
                        return _this.$c.initialize(service, bundle);
                    } else {
                        return service;
                    }
                },


                //construct service/factory
                initialize: function initialize(service, bundle) {
                    var args = Array.from(bundle);

                    //    service = _this.$c.execDecorator(service, bundle);

                    if (service.type === "service") {
                        (function () {
                            var serviceFn = service.content;

                            service.content = function () {

                                //Chevron service function wrapper

                                //    _this.$c.execMiddleware(service, bundle);

                                return serviceFn.apply(null, Array.from(args.concat(Array.from(arguments))));
                            };
                        })();
                    } else {
                        args = args.concat(service.args);
                        args.unshift(null);
                        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
                        service.content = new (Function.prototype.bind.apply(service.content, args))();
                    }

                    service.initialized = true;
                    return service;
                },


                //    execMiddleware(service, bundle) {
                //    _this.$c.execInject("middleware", service, inject => {
                //    inject.fn(service);
                //    });
                //    },
                //    execDecorator(service, bundle) {
                //    _this.$c.execInject("decorator", service, inject => {
                //    service.content = inject.fn(service.content);
                //    });
                //   
                //    return service;
                //    },
                //    execInject(type, service, fn) {
                //    _this.$u.each(_this.injects[type], inject => {
                //    if (_this.$c.injectorApplies(service.name, inject)) {
                //    fn(inject);
                //    }
                //    });
                //    },
                //    injectorApplies(name, inject) {
                //    return inject.applies.length === 0 ? true : inject.applies.includes(name);
                //    },

                exists: function exists(name) {
                    return _this.$u.isDefined(_this.container[name]);
                },
                get: function get(name) {
                    return _this.container[name];
                },
                hasDependencies: function hasDependencies(service) {
                    return service.dependencies.length > 0;
                }
            };
            /*####################/
            * Internal Utility methods
            /####################*/
            _this.$u = {
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
                },

                /*filterObject(obj, fn) {
                    let result = {};
                     _this.$u.eachObject(obj, (item, key, index) => {
                        if (fn(item, key, index)) {
                            result[key] = item;
                        }
                    });
                     return result;
                },*/
                //return if val is defined
                isDefined: function isDefined(val) {
                    return typeof val !== "undefined";
                }
            };
        }
        /*####################/
        * Main exposed methods
        /####################*/
        //Core service/factory method


        _createClass(Chevron, [{
            key: "provider",
            value: function provider(name, dependencyList, content, type, args) {
                var _this = this;

                if (_this.$c.exists(name)) {
                    throw _this.name + ": error in " + type + ": service '" + name + "' is already defined";
                } else {
                    _this.$c.add(name, dependencyList, type, content, args);

                    return _this;
                }
            }
            //create new service

        }, {
            key: "service",
            value: function service(name, dependencyList, fn) {
                return this.provider(name, dependencyList, fn, "service");
            }
            //create new factory

        }, {
            key: "factory",
            value: function factory(name, dependencyList, Constructor, args) {
                return this.provider(name, dependencyList, Constructor, "factory", args);
            }

            //    /*Core decorator/middleware method*/
            //    injector(type, fn, applies) {
            //    let _this = this;
            //   
            //    _this.injects[type].push({
            //    fn,
            //    applies: applies || []
            //    });
            //   
            //    return _this;
            //    }
            //    /*Injects a decorator to a service/factory*/
            //    decorator(fn, applies) {
            //    return this.injector("decorator", fn, applies);
            //    }
            //    /*Injects a middleware to a service*/
            //    middleware(fn, applies) {
            //    return this.injector("middleware", fn, applies);
            //    }

            //prepare/initialize services/factory with dependencies injected

        }, {
            key: "access",
            value: function access(name) {
                var _this = this;

                //Check if accessed service is registered
                if (_this.$c.exists(name)) {
                    return _this.$c.prepare(_this.$c.get(name)).content;
                } else {
                    throw _this.name + ": error accessing " + name + ": '" + name + "' is not defined";
                }
            }
            //returns service container

        }, {
            key: "list",
            value: function list() {
                return this.container;
            }
        }]);

        return Chevron;
    }();

    window.Chevron = Chevron;
})(window);
//# sourceMappingURL=chevron-lite-es5.js.map
