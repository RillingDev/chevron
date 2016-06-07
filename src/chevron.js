/*
chevronjs v0.1.0

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

    let chevron = {
        v: "0.1.0",
        dependencies: {},
        modules: {},

        module: function (name, dependencies, fn) {
            chevron.modules[name] = new(class {
                constructor(name, dependencies, fn) {

                    this.name = name;
                    this.dependencies = chevron.async.loadDependencies(dependencies);

                    if (chevron.isDefined(fn)) {
                        fn.apply(this.dependencies,this.dependencies);
                    }
                }
            })(name, dependencies, fn);
        },

        /*--------------------------------------------------------------------------*/
        /**
         * Async
         */

        async: {
            loadDependencies: function (list) {
                let result = [];
                chevron.each(list, item => {
                    chevron.async.requireDependency(item).then(dependency => {
                        if (!chevron.isDefined(result[item])) {
                            chevron.async.addDependency(item, dependency);
                            result.push(dependency);
                        }
                    });
                });
                return result;
            },
            requireDependency: function (key) {
                return new Promise((resolve, reject) => {
                    let result;
                    if (result = searchDependency(key)) {
                        resolve(result);
                    } else {
                        reject(chevron.log(this.name, "error", `dependency ${key} not found`));
                    }
                });

                function searchDependency(key) {
                    let result;

                    if (chevron.isDefined(chevron.dependencies[key])) {
                        result = chevron.dependencies[key];
                    } else if (chevron.isDefined(window[key])) {
                        result = window[key];
                    } else {
                        result = false;
                    }

                    return result;
                }
            },
            addDependency: function (name, dependency) {
                if (chevron.isDefined(chevron.dependencies[name])) {
                    return false;
                } else {
                    chevron.dependencies[name] = dependency;
                    return true;
                }
            }
        },

        /*--------------------------------------------------------------------------*/
        /**
         * Utility
         */
        each: function (arr, fn) {
            for (let i = 0, l = arr.length; i < l; i++) {
                fn(arr[i], i);
            }
        },
        eachObject: function (object, fn) {
            let keys = Object.keys(object);
            for (let i = 0, l = keys.length; i < l; i++) {
                fn(object[keys[i]], i);
            }
        },

        isDefined: function (val) {
            return typeof val !== "undefined";
        },
        log(name, type, msg) {
            let str = `Chevron: ${type} in module ${name}: ${msg}`;
            if (type === "error") {
                throw str;
            } else {
                console.log(str);
            }
        }

    };

    window.chevron = chevron;

})(window);
