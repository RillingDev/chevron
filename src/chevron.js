/*
chevronjs v2.0.1

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

    window.Chevron = class {
        constructor(n) {
                let _this = this;

                _this.n = n || "cv";

                _this.ct = {};

                /*####################/
                * Internal Chevron methods
                /####################*/
                _this.$c = {
                    //add new service
                    add(n, dependencyList, t, fn, args) {
                        let service = _this.ct[n] = {
                            n,
                            t,
                            d: dependencyList || [],
                            fn,
                            i: false
                        };
                        //Add type specific props
                        if (t === "factory") {
                            service.args = args || [];
                        }
                    },
                    //Check i status/d and issues iialize
                    pre(service) {
                        let list = {};

                        _this.$c.dep(
                            service.d,
                            dependency => {
                                list[dependency.n] = _this.$c.bnd(dependency, list).fn;
                            },
                            n => {
                                throw `${_this.n}: error in ${service.n}: dependency '${n}' is missing`;
                            }
                        );

                        return _this.$c.bnd(service, list);
                    },
                    //Iterate d
                    dep(dependencyList, fn, error) {
                        _this.$u.eA(dependencyList, n => {
                            if (_this.$c.exi(n)) {
                                let service = _this.$c.get(n);

                                if (service.d.length > 0) {
                                    //recurse
                                    _this.$c.dep(service.d, fn, error);
                                }
                                fn(service);
                            } else {
                                error(n);
                            }
                        });
                    },
                    bnd(service, list) {
                        let bundle = [];

                        _this.$u.eO(list, (item, key) => {
                            if (service.d.includes(key)) {
                                bundle.push(item);
                            }
                        });

                        if (!service.i) {
                            return _this.$c.in(service, Array.from(bundle));
                        } else {
                            return service;
                        }
                    },

                    //construct service/factory
                    in (service, bundle) {
                        if (service.t === "service") {
                            let serviceFn = service.fn;

                            service.fn = function () {
                                //Chevron service function wrapper
                                return serviceFn.apply(null,
                                    Array.from(bundle.concat(Array.from(arguments)))
                                );
                            };
                        } else {
                            bundle = bundle.concat(service.args);
                            bundle.unshift(null);
                            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
                            service.fn = new(Function.prototype.bind.apply(service.fn, bundle));
                        }

                        service.i = true;
                        return service;
                    },
                    exi(n) {
                        return typeof _this.ct[n] !== "undefined";
                    },
                    get(n) {
                        return _this.ct[n];
                    },
                };
                /*####################/
                * Internal Utility methods
                /####################*/
                _this.$u = {
                    //Iterate
                    eA(arr, fn) {
                        for (let i = 0, l = arr.length; i < l; i++) {
                            fn(arr[i], i);
                        }
                    },
                    eO(object, fn) {
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
        provider(n, dependencyList, fn, t, args) {
                let _this = this;

                if (_this.$c.exi(n)) {
                    throw `${_this.n}: error in ${t}: service '${n}' is already defined`;
                } else {
                    _this.$c.add(n, dependencyList, t, fn, args);

                    return _this;
                }
            }
            //create new service
        service(n, dependencyList, fn) {
                return this.provider(
                    n,
                    dependencyList,
                    fn,
                    "service"
                );
            }
            //create new factory
        factory(n, dependencyList, Constructor, args) {
                return this.provider(
                    n,
                    dependencyList,
                    Constructor,
                    "factory",
                    args
                );
            }
            //prepare/iialize services/factory with d injected
        access(n) {
            let _this = this;

            //Check if accessed service is registered
            if (_this.$c.exi(n)) {
                return _this.$c.pre(_this.$c.get(n)).fn;
            } else {
                throw `${_this.n}: error accessing ${n}: '${n}' is not defined`;
            }

        }
    };

})(window);
