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

(function(window) {

    window.chevron = class {
        constructor(name, dependencies) {
            let _this = this;

            _this.name = name;


            _this.util = {
                each: function(arr, fn) {
                    for (let i = 0, l = arr.length; i < l; i++) {
                        fn(arr[i], i);
                    }
                },
                eachObject: function(object, fn) {
                    let keys = Object.keys(object);
                    for (let i = 0, l = keys.length; i < l; i++) {
                        fn(object[keys[i]], i);
                    }
                },

                isDefined: function(val) {
                    return typeof val !== "undefined";
                }
            };

            _this.async = {
                loadDependencies: function(list) {
                    let result = {};

                    _this.util.each(list, item => {
                        _this.async.requireDependency(item).then(dependency => {
                            if (!_this.util.isDefined(result[item])) {
                                result[item] = dependency;
                            }
                        });
                    });

                    return result;
                },
                requireDependency: function(key) {
                    return new Promise((resolve, reject) => {
                        if (_this.util.isDefined(window[key])) {
                            resolve(window[key]);
                        } else {
                            reject(_this.error(`dependency ${key} not found`));
                        }
                    });
                }
            };

            _this.dependencies = _this.async.loadDependencies(dependencies);

        }
        error(msg) {
            throw `Chevron: error in module ${this.name}: ${msg}`;
        }

    };



})(window);
