/*
chevronjs v0.5.0

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

            //All chevron methods
            _this.cv = {
                //Returns if Array of dependencies exists

                load: function load(dependencyList, done) {
                    var result = true;

                    _this.cv.ut.each(dependencyList, function (dependency) {
                        /*if (!_this.cv.exists(dependency)) {
                          error();
                        }*/
                    });
                    if (result) {
                        done();
                    }

                    return result;
                },

                //Bundle dependencies for service/factory
                collect: function collect(dependencyList, map, error) {
                    var result = {},
                        missingDependency = void 0;

                    _this.cv.ut.each(dependencyList, function (dependency) {
                        var service = _this.container[dependency];
                        if (_this.cv.ut.isDefined(service)) {
                            //Init factory if not done already
                            if (service.type === "factory" && !service.constructed) {
                                (function () {
                                    var name = dependency,
                                        bundle = _this.cv.collect(service.dependencies, function (item) {
                                        return item;
                                    }, function (missing) {
                                        _this.cv.throwMissingDep(name, service.type, missing);
                                    });

                                    _this.cv.construct(name, bundle);
                                })();
                            }
                            result[dependency] = map(service);
                        } else {
                            error(dependency);
                        }
                    });

                    return result;
                },
                add: function add(name, dependencyList, type, content, args) {
                    var service = _this.container[name] = {
                        dependencies: dependencyList || [],
                        type: type || null,
                        content: content || null,
                        inject: {
                            middleware: []
                            //decorator: null
                        }
                    };
                    //Add type specific props
                    if (type === "factory") {
                        service.args = args || [];
                        service.constructed = false;
                    } else if (type === "service") {
                        service.content = function () {
                            _this.cv.runInjects(name, arguments);
                            return content.apply(this, arguments);
                        };
                    }
                },

                //construct factory
                construct: function construct(name, bundle) {
                    var Factory = _this.container[name],
                        container = Object.create(Factory.prototype || Object.prototype),
                        newArgs = Array.from(Factory.args || []);

                    newArgs.shift();

                    _this.cv.ut.eachObject(bundle, function (dependency, name) {
                        container[name] = dependency.content;
                    });

                    Factory.content = Factory.content.apply(container, newArgs) || container;
                    Factory.constructed = true;
                    return Factory.content;
                },

                //Inject decorator/middleware into service
                inject: function inject(name, type, fn) {
                    _this.container[name].inject[type].push(fn);
                },
                runInjects: function runInjects(name, args) {
                    var _this2 = this;

                    var service = _this.container[name],
                        bundle = _this.cv.collect(service.dependencies, function (item) {
                        return item.content;
                    }, function (missing) {
                        _this.cv.throwMissingDep(name, service.type, missing);
                    }),
                        newArgs = Array.from(args || []);
                    newArgs.unshift(name);

                    if (_this.cv.ut.isDefined(service.inject.middleware)) {
                        _this.cv.ut.each(service.inject.middleware, function (fn) {

                            fn.apply(_this2, newArgs);
                        });
                    }
                },

                //return if service has type
                hasType: function hasType(name, type) {
                    return _this.container[name].type === type;
                },

                //returns if dependency exists
                exists: function exists(name) {
                    return _this.cv.ut.isDefined(_this.container[name]);
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

                //All utility methods
                ut: {
                    //Iterate Array

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
        //Core Provider method


        _createClass(Chevron, [{
            key: "provider",
            value: function provider(name, dependencyList, content, type, args) {
                var _this = this;

                _this.cv.load(dependencyList, function () {
                    if (!_this.cv.exists(name)) {
                        _this.cv.add(name, dependencyList, type, content, args);
                    } else {
                        _this.cv.throwDupe(name, type);
                    }
                }
                /*, missing => {
                                    _this.cv.throwMissingDep(name, type, missing);
                                }*/
                );
                return _this;
            }
            //accepts function

        }, {
            key: "service",
            value: function service(name, dependencies, fn) {
                var _this = this;

                return _this.provider(name, dependencies, fn, "service");
            }
            //accepts constructor function

        }, {
            key: "factory",
            value: function factory(name, dependencies, Class, args) {
                var _this = this;
                args.unshift(null);

                return _this.provider(name, dependencies, Class, "factory", args);
            }
            //Injects a decorator to the container/service
            /*decorator(fn, service) {
              }*/
            //Injects a middleware to the container/service

        }, {
            key: "middleware",
            value: function middleware(fn, applies) {
                var _this = this;

                _this.cv.ut.eachObject(_this.container, function (service, name) {
                    //Inject for some services only if argument is present
                    if (_this.cv.ut.isDefined(applies)) {
                        if (applies.includes(name)) {
                            _this.cv.inject(name, "middleware", fn);
                        }
                    } else {
                        _this.cv.inject(name, "middleware", fn);
                    }
                });

                return _this;
            }
            //Lets you access services with their dependencies injected

        }, {
            key: "access",
            value: function access(name) {
                var _this = this,
                    result = void 0,
                    service = _this.container[name];

                //Check if accessed service is registered
                if (!_this.cv.ut.isDefined(service)) {
                    _this.cv.throwNotFound(name);
                }

                if (service.type === "service") {
                    var bundle = _this.cv.collect(service.dependencies, function (item) {
                        return item.content;
                    }, function (missing) {
                        _this.cv.throwMissingDep(name, service.type, missing);
                    });
                    result = service.content.bind(bundle);
                } else if (service.type === "factory") {
                    var _bundle = _this.cv.collect(service.dependencies, function (item) {
                        return item;
                    }, function (missing) {
                        _this.cv.throwMissingDep(name, service.type, missing);
                    });
                    if (!service.constructed) {
                        result = _this.cv.construct(name, _bundle);
                    }
                }

                return result;
            }
            //returns Array of dependencies

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
