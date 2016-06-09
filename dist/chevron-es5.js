/*
chevronjs v0.3.1

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    var Chevron = function () {
        function Chevron() {
            var name = arguments.length <= 0 || arguments[0] === undefined ? "Chevron" : arguments[0];

            _classCallCheck(this, Chevron);

            var _this = this;
            _this.name = name;
            _this.version = "0.3.1";
            _this.container = {};

            //All chevron related methods
            _this.chevron = {
                //Returns if Array of dependencies exists
                load: function load(dependencies, done, error) {
                    var result = true;

                    _this.chevron.util.each(dependencies, function (dependency) {
                        if (!_this.chevron.exists(dependency)) {
                            error(dependency);
                            result = false;
                        }
                    });
                    if (result) {
                        done();
                    }

                    return result;
                },
                //Bundle dependencies from Array to object
                bundle: function bundle(dependencies) {
                    var result = {};

                    _this.chevron.util.each(dependencies, function (dependency) {
                        result[dependency] = _this.container[dependency].content;
                    });

                    return result;
                },

                //returns if dependency exists
                exists: function exists(dependency) {
                    return _this.chevron.util.isDefined(_this.container[dependency]);
                },

                //returns Array of dependencies
                list: function list() {
                    return _this.container;
                },

                //All generic methods
                util: {
                    //Iterate Array
                    each: function each(arr, fn) {
                        for (var i = 0, l = arr.length; i < l; i++) {
                            fn(arr[i], i);
                        }
                    },
                    //return if val is defined
                    isDefined: function isDefined(val) {
                        return typeof val !== "undefined";
                    },
                    //logs/throws error
                    log: function log(app, name, type, element, msg) {
                        var str = app + " " + type + " in " + element + " '" + name + "': " + msg;
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
            value: function provider(name, dependencies, content, type, finish) {
                var _this = this;

                _this.chevron.load(dependencies, function () {
                    if (!_this.chevron.exists(name)) {
                        finish(name);
                    } else {
                        _this.chevron.util.log(_this.name, name, "error", type, "service '" + name + "' already declared");
                    }
                }, function (missing) {
                    _this.chevron.util.log(_this.name, name, "error", type, "dependency '" + missing + "' not found");
                });
            }
            //accepts all data

        }, {
            key: "service",
            value: function service(name, dependencies, content) {
                var _this = this;

                return _this.provider(name, dependencies, content, "service", function () {
                    _this.container[name] = {
                        dependencies: dependencies,
                        type: typeof content === "undefined" ? "undefined" : _typeof(content),
                        content: content
                    };
                });
            }
            //accepts constructor function

        }, {
            key: "factory",
            value: function factory(name, dependencies, Class, args) {
                var _this = this;
                args.unshift(null);

                return _this.provider(name, dependencies, Class, "factory", function () {
                    _this.container[name] = {
                        dependencies: dependencies,
                        type: "object",
                        content: new (Function.prototype.bind.apply(Class, args))()
                    };
                });
            }
            //Lets you access services with their dependencies injected

        }, {
            key: "access",
            value: function access(name) {
                var _this = this,
                    result = void 0,
                    service = _this.container[name];

                if (service.type === "function") {
                    result = service.content.bind(_this.chevron.bundle(service.dependencies));
                } else {
                    result = service.content;
                }

                return result;
            }
        }]);

        return Chevron;
    }();

    window.Chevron = Chevron;
})(window);
//# sourceMappingURL=chevron-es5.js.map
