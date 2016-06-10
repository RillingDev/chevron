/*
chevronjs v0.4.0

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
        constructor(name = "Chevron", lazy = true) {
                let _this = this;
                _this.options = {
                    name,
                    lazy
                };
                _this.container = {};

                //All chevron related methods
                _this.chevron = {
                    //Returns if Array of dependencies exists
                    load: function (dependencies, done, error) {
                        let result = true;

                        _this.chevron.util.each(dependencies, dependency => {
                            if (!_this.chevron.exists(dependency)) {
                                //only error if lazyloading is disabled
                                if (!_this.options.lazy) {
                                    error(dependency);
                                    result = false;
                                }
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
                    //returns if dependency exists
                    exists(dependency) {
                        return _this.chevron.util.isDefined(_this.container[dependency]);
                    },
                    //returns Array of dependencies
                    list() {
                        return _this.container;
                    },
                    //All generic methods
                    util: {
                        //Iterate Array
                        each: function (arr, fn) {
                            for (let i = 0, l = arr.length; i < l; i++) {
                                fn(arr[i], i);
                            }
                        },
                        //return if val is defined
                        isDefined: function (val) {
                            return typeof val !== "undefined";
                        },
                        //logs/throws error
                        log(app, name, type, element, msg) {
                            let str = `${app} ${type} in ${element} '${name}': ${msg}`;
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
                        finish(name);
                    } else {
                        _this.chevron.util.log(
                            _this.options.name,
                            name,
                            "error",
                            type,
                            `service '${name}' already declared`
                        );
                    }
                }, missing => {
                    _this.chevron.util.log(
                        _this.options.name,
                        name,
                        "error",
                        type,
                        `dependency '${missing}' not found`
                    );
                });
            }
            //accepts all data
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
                            type: typeof content,
                            content
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
                            type: "object",
                            content: new(Function.prototype.bind.apply(Class, args))
                        };
                    });
            }
            //Lets you access services with their dependencies injected
        access(name) {
            let _this = this,
                result,
                service = _this.container[name];

            if (service.type === "function") {
                let bundle = _this.chevron.bundle(service.dependencies, missing => {
                    _this.chevron.util.log(
                        _this.options.name,
                        name,
                        "error",
                        "service",
                        `dependency '${missing}' not found`
                    );
                });

                result = service.content.bind(
                    _this.chevron.bundle(service.dependencies)
                );
            } else {
                result = service.content;
            }

            return result;
        }
    }

    window.Chevron = Chevron;
})(window);
