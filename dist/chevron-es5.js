/*
chevronjs v0.6.1

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
            var name = arguments.length <= 0 || arguments[0] === undefined ? "Chevron" : arguments[0];

            _classCallCheck(this, Chevron);

            var _this = this;

            _this.options = {
                name: name
            };
            _this.container = {};
            _this.injects = {
                middleware: [],
                decorator: []
            };

            /*####################/
            * Internal Chevron
            /####################*/
            _this.cv = {
                //Check constructed status/dependencies and issues construct

                prepare: function prepare(service) {
                    var result = void 0,
                        bundle = {};

                    _this.cv.fetchDependencies(service.dependencies, function (dependency, name) {
                        var result = void 0;

                        if (!dependency.constructed) {
                            result = _this.cv.construct(dependency, bundle);
                        } else {
                            result = dependency;
                        }

                        bundle[name] = result.content;
                    }, function (name) {
                        _this.throwMissingDep(name);
                    });

                    if (!service.constructed) {
                        result = _this.cv.construct(service, bundle);
                    } else {
                        result = service;
                    }

                    return result;
                },

                //Iterate dependencies
                fetchDependencies: function fetchDependencies(dependencyList, fn, error) {
                    _this.cv.ut.each(dependencyList, function (name) {

                        if (_this.cv.exists(name)) {
                            var service = _this.cv.get(name);

                            if (_this.cv.hasDependencies(service)) {
                                //recurse
                                _this.cv.fetchDependencies(service.dependencies, fn, error);
                            }
                            fn(service, name);
                        } else {
                            error(name);
                        }
                    });
                },

                //add new service
                add: function add(name, dependencyList, type, content, args) {
                    var service = _this.container[name] = {
                        dependencies: dependencyList || [],
                        type: type,
                        content: content,
                        constructed: false,
                        name: name
                    };
                    //Add type specific props
                    if (type === "factory") {
                        service.args = args || [];
                        service.args.shift();
                    }
                },

                //construct service/factory
                construct: function construct(service, bundle) {
                    service = _this.cv.runDecorator(service, bundle);

                    if (_this.cv.hasType(service, "service")) {
                        (function () {
                            var serviceFn = service.content;

                            service.content = function () {
                                _this.cv.runMiddleware(service, bundle);
                                return serviceFn.apply(bundle, arguments);
                            };
                        })();
                    } else if (_this.cv.hasType(service, "factory")) {
                        (function () {
                            var container = Object.create(service.prototype || Object.prototype);

                            _this.cv.ut.eachObject(bundle, function (dependency, name) {
                                container[name] = dependency;
                            });

                            service.content = service.content.apply(container, service.args) || container;

                            /*service.content = function() {
                                _this.cv.runMiddleware(service, bundle);
                                return newContent;
                            };*/
                        })();
                    }

                    service.constructed = true;
                    return service;
                },
                runMiddleware: function runMiddleware(service, bundle) {
                    _this.cv.runInject("middleware", service, function (inject) {
                        inject.fn.call(bundle, service);
                    });
                },
                runDecorator: function runDecorator(service, bundle) {
                    var result = false;

                    _this.cv.runInject("decorator", service, function (inject) {
                        //result = inject.fn;
                    });

                    return result === false ? service : result;
                },
                runInject: function runInject(type, service, fn) {
                    _this.cv.ut.each(_this.injects[type], function (inject) {
                        if (_this.cv.injectorApplies(service.name, inject)) {
                            fn(inject);
                        }
                    });
                },
                injectorApplies: function injectorApplies(name, inject) {
                    return inject.applies.length === 0 ? true : inject.applies.includes(name);
                },
                exists: function exists(name) {
                    return _this.cv.ut.isDefined(_this.container[name]);
                },
                get: function get(name) {
                    return _this.container[name];
                },
                hasType: function hasType(service, type) {
                    return service.type === type;
                },
                hasDependencies: function hasDependencies(service) {
                    return service.dependencies.length > 0;
                },

                //throws errors
                throwMissingDep: function throwMissingDep(name, type, missing) {
                    _this.cv.ut.log(name, "error", type, "dependency '" + missing + "' not found");
                },
                throwNotFound: function throwNotFound(name) {
                    _this.cv.ut.log(name, "error", "type", "service '" + name + "' not found");
                },
                throwDupe: function throwDupe(name, type) {
                    _this.cv.ut.log(name, "error", type, "service '" + name + "' is already defined");
                },

                /*####################/
                * Internal Chevron Utility
                /####################*/
                ut: {
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

                    //return if val is defined
                    isDefined: function isDefined(val) {
                        return typeof val !== "undefined";
                    },

                    //log
                    log: function log(name, type, element, msg) {
                        var str = _this.options.name + " " + type + " in " + element + " '" + name + "': " + msg;
                        if (type === "error") {
                            throw str;
                        } else {
                            console.log(str);
                        }
                    }
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

                if (!_this.cv.exists(name)) {
                    _this.cv.add(name, dependencyList, type, content, args);
                } else {
                    _this.cv.throwDupe(name, type);
                }

                return _this;
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
                args.unshift(null);
                return this.provider(name, dependencyList, Constructor, "factory", args);
            }
            //Core decorator/middleware method

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
            //Injects a decorator to a service/factory

        }, {
            key: "decorator",
            value: function decorator(fn, applies) {
                return this.injector("decorator", fn, applies);
            }
            //Injects a middleware to a service

        }, {
            key: "middleware",
            value: function middleware(fn, applies) {
                return this.injector("middleware", fn, applies);
            }
            //prepare/initialize services/factory with dependencies injected

        }, {
            key: "access",
            value: function access(name) {
                var _this = this;

                //Check if accessed service is registered
                if (!_this.cv.exists(name)) {
                    _this.cv.throwNotFound(name);
                } else {
                    return _this.cv.prepare(_this.cv.get(name)).content;
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
