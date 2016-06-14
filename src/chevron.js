/*
chevronjs v0.4.1

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

                //All chevron related methods
                _this.chevron = {
                    //Returns if Array of dependencies exists
                    load(dependencies, done, error) {
                        let result = true;

                        _this.chevron.util.each(dependencies, dependency => {
                            if (!_this.chevron.exists(dependency)) {
                                /*
                                error(dependency);
                                result = false;
                                */
                            }
                        });
                        if (result) {
                            done();
                        }

                        return result;
                    },
                    //Bundle dependencies from Array to object
                    bundle(dependencies, error) {
                        let result = {};

                        _this.chevron.util.each(dependencies, dependency => {
                            let content;

                            if (content = _this.container[dependency].content) {
                                result[dependency] = content;
                            } else {
                                error(dependency);
                            }
                        });

                        return result;
                    },
                    add(name, dependencies, type, content) {
                        _this.container[name] = {
                            dependencies: [],
                            type,
                            content,
                            inject: {
                                middleware: [],
                                decorator: []
                            }
                        };
                    },
                    //Inject decortator/middleware into service
                    inject(service, type, fn) {
                        _this.container[service].inject[type].push(fn);
                    },
                    //return if service has type
                    hasType(service, type) {
                        return _this.container[service].type === type;
                    },
                    //returns if dependency exists
                    exists(dependency) {
                        return _this.chevron.util.isDefined(_this.container[dependency]);
                    },
                    //All generic methods
                    util: {
                        //Iterate Array
                        each(arr, fn) {
                            for (let i = 0, l = arr.length; i < l; i++) {
                                fn(arr[i], i);
                            }
                        },
                        eachObject(object, fn) {
                            let keys = Object.keys(object);
                            for (let i = 0, l = keys.length; i < l; i++) {
                                fn(object[keys[i]], i);
                            }
                        },
                        //return if val is defined
                        isDefined(val) {
                            return typeof val !== "undefined";
                        },
                        //logs/throws error
                        log(name, type, element, msg) {
                            let str = `${this.options.name} ${type} in ${element} '${name}': ${msg}`;
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
        provider(name, dependencies, content, type, finish) {
                let _this = this;

                _this.chevron.load(dependencies, () => {
                    if (!_this.chevron.exists(name)) {
                        _this.chevron.add(name, dependencies, type, content);
                    } else {
                        _this.chevron.util.log(
                            name,
                            "error",
                            type,
                            `service '${name}' already declared`
                        );
                    }
                }, missing => {
                    _this.chevron.util.log(
                        name,
                        "error",
                        type,
                        `dependency '${missing}' not found`
                    );
                });
            }
            //accepts function
        service(name, dependencies, content) {
                let _this = this;

                return _this.provider(
                    name,
                    dependencies,
                    content,
                    "service",
                    () => {
                        _this.container[name] = {
                            dependencies,
                            type: "service",
                            content,
                            inject: []
                        };
                    });
            }
            //accepts constructor function
        factory(name, dependencies, Class, args) {
                let _this = this;
                args.unshift(null);

                return _this.provider(
                    name,
                    dependencies,
                    Class,
                    "factory",
                    () => {
                        _this.container[name] = {
                            dependencies,
                            type: "factory",
                            content: new(Function.prototype.bind.apply(Class, args)),
                            inject: []
                        };
                    });
            }
            //Injects a decorator to the container/service
            /*decorator(fn, service) {

            }*/
            //Injects a middleware to the container/service
        middleware(fn, applies) {
                let _this = this,
                    keys = Object.keys(_this.container);

                _this.chevron.util.eachObject(_this.container, (service, index) => {
                    let name = keys[index];
                    //Inject for some services only if argument is present
                    if (_this.chevron.util.isDefined(applies)) {
                        if (applies.includes(name)) {
                            _this.chevron.inject(name, "middleware", fn);
                        }
                    } else {
                        _this.chevron.inject(name, "middleware", fn);
                    }
                });

                return fn;
            }
            //Lets you access services with their dependencies injected
        access(name) {
                let _this = this,
                    result,
                    service = _this.container[name];

                //only bind services
                if (service.type === "service") {
                    //collect dependencies in bundle
                    let bundle = _this.chevron.bundle(service.dependencies, missing => {
                        _this.chevron.util.log(
                            name,
                            "error",
                            "service",
                            `dependency '${missing}' not found`
                        );
                    });

                    //Fire inject
                    if (_this.chevron.util.isDefined(service.inject)) {
                        _this.chevron.util.each(service.inject, fn => {
                            fn.call(bundle, service, name);
                        });
                    }
                    //bind dependency-bundled function
                    result = service.content.bind(bundle);
                } else {
                    result = service.content;
                }

                return result;
            }
            //returns Array of dependencies
        list() {
            return this.container;
        }
    }

    window.Chevron = Chevron;
})(window);
