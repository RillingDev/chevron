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

            /*####################/
            * Internal Chevron
            /####################*/
            _this.cv = {
                //Returns if Array of dependencies exists

                load: function load(dependencyList, done) {
                    /*  let result = true;
                      _this.cv.ut.each(dependencyList, dependency => {
                      });
                    if (result) {
                        done();
                    }
                      return result;*/
                },
                prepare: function prepare(service) {
                    var result = void 0,
                        list = [];

                    _this.cv.fetchDependencies(service.dependencies, function (dependency) {
                        var result = void 0;
                        //console.log(dependency);
                        if (!dependency.constructed) {
                            result = _this.cv.construct(dependency);
                        } else {
                            result = dependency;
                        }

                        _this.cv.ut.pushIfUnique(list, result.content);
                    }, function (name) {
                        _this.throwMissingDep(name);
                    });

                    if (!service.constructed) {
                        result = _this.cv.construct(service);
                    } else {
                        result = service;
                    }

                    console.log("finished", list);

                    return result;
                },
                fetchDependencies: function fetchDependencies(dependencyList, fn, error) {
                    console.log("started", dependencyList);

                    _this.cv.ut.each(dependencyList, function (name) {

                        if (_this.cv.exists(name)) {
                            var service = _this.cv.get(name);
                            console.log("dep:", name, service);
                            fn(service, name);
                            if (_this.cv.hasDependencies(service)) {
                                //recurse
                                _this.cv.fetchDependencies(service.dependencies, fn, error);
                            }
                        } else {
                            error(name);
                        }
                    });
                },

                //Bundle dependencies for service/factory
                collect: function collect(dependencyList, map, error) {
                    var result = {};

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
                        constructed: false,
                        inject: {
                            middleware: []
                            //decorator: null
                        }
                    };
                    //Add type specific props
                    if (type === "factory") {
                        service.args = args || [];
                    }
                },


                //construct factory
                construct: function construct(service, bundle) {
                    /*let service = _this.container[name];
                      service.content = function() {
                        _this.cv.runInjects(name, arguments);
                        return service.content.apply(this, arguments);
                    };*/
                    /*  let Factory = _this.container[name],
                          container = Object.create(Factory.prototype || Object.prototype),
                          newArgs = Array.from(Factory.args || []);
                        newArgs.shift();
                        _this.cv.ut.eachObject(bundle, (dependency, name) => {
                          container[name] = dependency.content;
                      });
                        Factory.content = (Factory.content.apply(container, newArgs) || container);
                      Factory.constructed = true;
                      */
                    service.constructed = true;
                    return service;
                },

                //Inject decorator/middleware into service
                inject: function inject(name, type, fn) {
                    _this.container[name].inject[type].push(fn);
                },
                runInjects: function runInjects(name, args) {
                    /*  let service = _this.container[name],
                          bundle = _this.cv.collect(service.dependencies,
                              item => {
                                  return item.content;
                              },
                              missing => {
                                  _this.cv.throwMissingDep(name, service.type, missing);
                              }),
                          newArgs = Array.from(args || []);
                      newArgs.unshift(name);
                        if (_this.cv.ut.isDefined(service.inject.middleware)) {
                          _this.cv.ut.each(service.inject.middleware, fn => {
                                fn.apply(this, newArgs);
                          });
                      }*/
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
                    pushIfUnique: function pushIfUnique(arr, val) {
                        return arr.includes(val) ? arr : arr.push(val);
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
            //accepts function

        }, {
            key: "service",
            value: function service(name, dependencyList, fn) {
                return this.provider(name, dependencyList, fn, "service");
            }
            //accepts constructor function

        }, {
            key: "factory",
            value: function factory(name, dependencyList, Constructor, args) {
                args.unshift(null);
                return this.provider(name, dependencyList, Constructor, "factory", args);
            }
            //Injects a decorator to the container/service
            /*decorator(fn, service) {
              }*/
            //Injects a middleware to the container/service

        }, {
            key: "middleware",
            value: function middleware(fn, applies) {
                var _this = this;

                /*_this.cv.ut.eachObject(_this.container, (service, name) => {
                    //Inject for some services only if argument is present
                    if (_this.cv.ut.isDefined(applies)) {
                        if (applies.includes(name)) {
                            _this.cv.inject(name, "middleware", fn);
                        }
                    } else {
                        _this.cv.inject(name, "middleware", fn);
                    }
                });*/

                return _this;
            }
            //Lets you access services with their dependencies injected

        }, {
            key: "access",
            value: function access(name) {
                var _this = this,
                    service = _this.container[name];

                //Check if accessed service is registered
                if (!_this.cv.ut.isDefined(service)) {
                    _this.cv.throwNotFound(name);
                }

                return _this.cv.prepare(service);
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
