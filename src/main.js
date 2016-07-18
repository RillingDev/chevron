/*
Chevron v3.0.0

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

import {
    $c
} from "./chevron";

export class Container {
    constructor(name) {
            let _this = this;
            //_this.aaa = foo;
            _this.name = name || "cv";

            _this.container = {};

            /*####################/
            * Internal Chevron methods
            /####################*/
            _this.$c = $c;
            /*####################/
            * Internal Utility methods
            /####################*/
            _this.$u = {
                //Iterate
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
                }
            };
        }
        /*####################/
        * Main exposed methods
        /####################*/
        //Core service/factory method
    provider(name, dependencyList, fn, type, args) {
            let _this = this;

            if (_this.$c.exists(name)) {
                throw `${_this.name}: error in ${type}: service '${name}' is already defined`;
            } else {
                _this.$c.add(name, dependencyList, type, fn, args);

                return _this;
            }
        }
        //create new service
    service(name, dependencyList, fn) {
            return this.provider(
                name,
                dependencyList,
                fn,
                "service"
            );
        }
        //create new factory
    factory(name, dependencyList, Constructor, args) {
            return this.provider(
                name,
                dependencyList,
                Constructor,
                "factory",
                args
            );
        }
        //prepare/iialize services/factory with d injected
    access(name) {
        let _this = this;

        //Check if accessed service is registered
        if (_this.$c.exists(name)) {
            return _this.$c.prepare(_this.$c.get(name)).fn;
        } else {
            throw `${_this.name}: error accessing ${name}: '${name}' is not defined`;
        }

    }
}
