/*
chevronjs v2.0.0

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

    window.Chevron = function () {
        function _class(n) {
            _classCallCheck(this, _class);

            var _this = this;

            _this.n = n || "cv";

            _this.ct = {};

            /*####################/
            * Internal Chevron methods
            /####################*/
            _this.$c = {
                //add new service

                add: function add(n, dependencyList, t, fn, args) {
                    var service = _this.ct[n] = {
                        n: n,
                        t: t,
                        d: dependencyList || [],
                        fn: fn,
                        i: false
                    };
                    //Add type specific props
                    if (t === "factory") {
                        service.args = args || [];
                    }
                },

                //Check i status/d and issues iialize
                prep: function prep(service) {
                    var list = {};

                    _this.$c.d(service.d, function (dependency) {
                        list[dependency.n] = _this.$c.bndl(dependency, list).fn;
                    }, function (n) {
                        throw _this.n + ": error in " + service.n + ": dependency '" + n + "' is missing";
                    });

                    return _this.$c.bndl(service, list);
                },

                //Iterate d
                d: function d(dependencyList, fn, error) {
                    _this.$u.eA(dependencyList, function (n) {
                        if (_this.$c.ex(n)) {
                            var service = _this.$c.get(n);

                            if (service.d.length > 0) {
                                //recurse
                                _this.$c.d(service.d, fn, error);
                            }
                            fn(service);
                        } else {
                            error(n);
                        }
                    });
                },
                bndl: function bndl(service, list) {
                    var bundle = [];

                    _this.$u.eO(list, function (item, key) {
                        if (service.d.indexOf(key) !== -1) {
                            bundle.push(item);
                        }
                    });

                    if (!service.i) {
                        return _this.$c.i(service, Array.from(bundle));
                    } else {
                        return service;
                    }
                },


                //construct service/factory
                i: function i(service, bundle) {
                    if (service.t === "service") {
                        (function () {
                            var serviceFn = service.fn;

                            service.fn = function () {
                                //Chevron service function wrapper
                                return serviceFn.apply(null, Array.from(bundle.concat(Array.from(arguments))));
                            };
                        })();
                    } else {
                        bundle = bundle.concat(service.args);
                        bundle.unshift(null);
                        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
                        service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();
                    }

                    service.i = true;
                    return service;
                },
                ex: function ex(n) {
                    return typeof _this.ct[n] !== "undefined";
                },
                get: function get(n) {
                    return _this.ct[n];
                }
            };
            /*####################/
            * Internal Utility methods
            /####################*/
            _this.$u = {
                //Iterate

                eA: function eA(arr, fn) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        fn(arr[i], i);
                    }
                },
                eO: function eO(object, fn) {
                    var keys = Object.keys(object);
                    for (var i = 0, l = keys.length; i < l; i++) {
                        fn(object[keys[i]], keys[i], i);
                    }
                }
            };
        }
        /*####################/
        * Main exposed methods
        /####################*/
        //Core service/factory method


        _createClass(_class, [{
            key: "provider",
            value: function provider(n, dependencyList, fn, t, args) {
                var _this = this;

                if (_this.$c.ex(n)) {
                    throw _this.n + ": error in " + t + ": service '" + n + "' is already defined";
                } else {
                    _this.$c.add(n, dependencyList, t, fn, args);

                    return _this;
                }
            }
            //create new service

        }, {
            key: "service",
            value: function service(n, dependencyList, fn) {
                return this.provider(n, dependencyList, fn, "service");
            }
            //create new factory

        }, {
            key: "factory",
            value: function factory(n, dependencyList, Constructor, args) {
                return this.provider(n, dependencyList, Constructor, "factory", args);
            }
            //prepare/iialize services/factory with d injected

        }, {
            key: "access",
            value: function access(n) {
                var _this = this;

                //Check if accessed service is registered
                if (_this.$c.ex(n)) {
                    return _this.$c.prep(_this.$c.get(n)).fn;
                } else {
                    throw _this.n + ": error accessing " + n + ": '" + n + "' is not defined";
                }
            }
            //returns service ct

        }, {
            key: "list",
            value: function list() {
                return this.ct;
            }
        }]);

        return _class;
    }();
})(window);
//# sourceMappingURL=chevron-es5.js.map
