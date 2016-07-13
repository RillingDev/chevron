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
                    var bundle = _this.$u.filterObject(list, function (item, key) {
                        return service.dependencies.indexOf(key) !== -1;
                    });

                    if (!service.initialized) {
                        return _this.$c.initialize(service, bundle);
                    } else {
                        return service;
                    }
                },


                //construct service/factory
                initialize: function initialize(service, bundle) {
                    /* <!-- comments:toggle // --> */
                    service = _this.$c.execDecorator(service, bundle);
                    /* <!-- endcomments --> */

                    if (service.type === "service") {
                        (function () {
                            var serviceFn = service.content;

                            service.content = function () {
                                //Chevron service function wrapper
                                /* <!-- comments:toggle // --> */
                                _this.$c.execMiddleware(service, bundle);
                                /* <!-- endcomments --> */
                                return serviceFn.apply(bundle, arguments);
                            };
                        })();
                    } else {
                        (function () {
                            //Bind bundle into unconstructed object container
                            var container = Object.create(service.prototype || Object.prototype);

                            _this.$u.eachObject(bundle, function (dependency, name) {
                                container[name] = dependency;
                            });

                            service.content = service.content.apply(container, service.args) || container;
                        })();
                    }

                    service.initialized = true;
                    return service;
                },

                /* <!-- comments:toggle // --> */
                execMiddleware: function execMiddleware(service, bundle) {
                    _this.$c.execInject("middleware", service, function (inject) {
                        inject.fn.call(bundle, service);
                    });
                },
                execDecorator: function execDecorator(service, bundle) {
                    _this.$c.execInject("decorator", service, function (inject) {
                        service.content = inject.fn.call(bundle, service.content);
                    });

                    return service;
                },
                execInject: function execInject(type, service, fn) {
                    _this.$u.each(_this.injects[type], function (inject) {
                        if (_this.$c.injectorApplies(service.name, inject)) {
                            fn(inject);
                        }
                    });
                },
                injectorApplies: function injectorApplies(name, inject) {
                    return inject.applies.length === 0 ? true : inject.applies.indexOf(name) !== -1;
                },

                /* <!-- endcomments --> */
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
                filterObject: function filterObject(obj, fn) {
                    var result = {};

                    _this.$u.eachObject(obj, function (item, key, index) {
                        if (fn(item, key, index)) {
                            result[key] = item;
                        }
                    });

                    return result;
                },

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
            /* <!-- comments:toggle // --> */
            /*Core decorator/middleware method*/

        }, {
            key: "injector",
            value: function injector(type, fn, applies) {
                var _this = this;

                _this.injects[type].push({
                    fn: fn,
                    applies: applies || []
                });

                return _this;
            }
            /*Injects a decorator to a service/factory*/

        }, {
            key: "decorator",
            value: function decorator(fn, applies) {
                return this.injector("decorator", fn, applies);
            }
            /*Injects a middleware to a service*/

        }, {
            key: "middleware",
            value: function middleware(fn, applies) {
                return this.injector("middleware", fn, applies);
            }
            /* <!-- endcomments --> */
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
//# sourceMappingURL=chevron-es5.js.map
