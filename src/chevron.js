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

(function(window) {

    class Chevron {
        constructor(name = "Chevron") {
                let _this = this;

                _this.options = {
                    name
                };
                _this.container = {};

                /*####################/
                * Internal Chevron
                /####################*/
                _this.cv = {
                    //Returns if Array of dependencies exists
                    load(dependencyList, done) {
                        /*  let result = true;

                        _this.cv.ut.each(dependencyList, dependency => {

                        });
                        if (result) {
                            done();
                        }

                        return result;*/
                    },
                    //Check constructed status/dependencies and issues construct
                    prepare(service) {
                        let result,
                            list = {};

                        _this.cv.fetchDependencies(
                            service.dependencies,
                            (dependency, name) => {
                                let result;
                                //console.log(dependency);
                                if (!dependency.constructed) {
                                    result = _this.cv.construct(dependency, list);
                                } else {
                                    result = dependency;
                                }
                                //  console.log(result);
                                list[name] = result.content;
                                //console.log("PRE", list);
                            },
                            name => {
                                _this.throwMissingDep(name);
                            }
                        );

                        if (!service.constructed) {
                            result = _this.cv.construct(service, list);
                        } else {
                            result = service;
                        }

                        //console.log("PRE finished", list);

                        return result;
                    },
                    //Iterate dependencies
                    fetchDependencies(dependencyList, fn, error) {
                        //console.log("FE started", dependencyList);

                        _this.cv.ut.each(dependencyList, name => {

                            if (_this.cv.exists(name)) {
                                let service = _this.cv.get(name);
                                //console.log("FE dep:", name, service);

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
                    //Bundle dependencies for service/factory
                    collect(dependencyList, map, error) {
                        /*let result = {};

                        _this.cv.ut.each(dependencyList, dependency => {
                            let service = _this.container[dependency];
                            if (_this.cv.ut.isDefined(service)) {
                                //Init factory if not done already
                                if (service.type === "factory" && !service.constructed) {
                                    let name = dependency,
                                        bundle = _this.cv.collect(service.dependencies,
                                            item => {
                                                return item;
                                            },
                                            missing => {
                                                _this.cv.throwMissingDep(name, service.type, missing);
                                            });

                                    _this.cv.construct(name, bundle);
                                }
                                result[dependency] = map(service);
                            } else {
                                error(dependency);
                            }
                        });

                        return result;*/
                    },
                    add(name, dependencyList, type, content, args) {
                        let service = _this.container[name] = {
                            dependencies: dependencyList || [],
                            type: type || null,
                            content: content || null,
                            constructed: false,
                            inject: {
                                middleware: []
                                    //decorator: null
                            },
                        };
                        //Add type specific props
                        if (type === "factory") {
                            service.args = args || [];
                            service.args.shift();
                        }
                    },

                    //construct
                    construct(service, bundle) {
                        //console.log("CN started constructing", service, bundle);
                        if (_this.cv.hasType(service, "service")) {
                            //@TODO inject
                            service.content = service.content.bind(bundle);
                        } else if (_this.cv.hasType(service, "factory")) {
                            let container = Object.create(service.prototype || Object.prototype);

                            _this.cv.ut.eachObject(bundle, (dependency, name) => {
                                container[name] = dependency;
                                //console.log(dependency, name, container[name]);
                            });

                            service.content = (service.content.apply(container, service.args) || container);
                        }

                        service.constructed = true;
                        //console.log("CN finished constructing", service, bundle);
                        return service;
                    },
                    //Inject decorator/middleware into service
                    inject(name, type, fn) {
                        _this.container[name].inject[type].push(fn);
                    },
                    runInjects(name, args) {
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
                    exists(name) {
                        return _this.cv.ut.isDefined(_this.container[name]);
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
                        _this.cv.ut.log(
                            name,
                            "error",
                            type,
                            `dependency '${missing}' not found`
                        );
                    },
                    throwNotFound(name) {
                        _this.cv.ut.log(
                            name,
                            "error",
                            "type",
                            `service '${name}' not found`
                        );
                    },
                    throwDupe(name, type) {
                        _this.cv.ut.log(
                            name,
                            "error",
                            type,
                            `service '${name}' is already defined`
                        );
                    },
                    /*####################/
                    * Internal Chevron Utility
                    /####################*/
                    ut: {
                        //Iterate Array
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
                        //return if val is defined
                        isDefined(val) {
                            return typeof val !== "undefined";
                        },
                        /*pushIfUnique(arr, val) {
                            return arr.includes(val) ? arr : arr.push(val);
                        },*/
                        //log
                        log(name, type, element, msg) {
                            let str = `${_this.options.name} ${type} in ${element} '${name}': ${msg}`;
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
        provider(name, dependencyList, content, type, args) {
                let _this = this;

                if (!_this.cv.exists(name)) {
                    _this.cv.add(name, dependencyList, type, content, args);
                } else {
                    _this.cv.throwDupe(name, type);
                }

                return _this;
            }
            //accepts function
        service(name, dependencyList, fn) {
                return this.provider(
                    name,
                    dependencyList,
                    fn,
                    "service"
                );
            }
            //accepts constructor function
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
            //Injects a decorator to the container/service
            /*decorator(fn, service) {

            }*/
            //Injects a middleware to the container/service
        middleware(fn, applies) {
                let _this = this;

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
        access(name) {
                let _this = this,
                    service = _this.container[name];

                //Check if accessed service is registered
                if (!_this.cv.ut.isDefined(service)) {
                    _this.cv.throwNotFound(name);
                }


                return _this.cv.prepare(service).content;
            }
            //returns Array of dependencies
        list() {
            return this.container;
        }
    }

    window.Chevron = Chevron;
})(window);
