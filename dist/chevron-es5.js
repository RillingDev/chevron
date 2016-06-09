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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    var Chevron = function () {
        function Chevron() {
            _classCallCheck(this, Chevron);

            var _this = this;
            _this.container = {};
            _this.dependency = {
                load: function load(dependencies, finish, fail) {
                    var result = true;

                    _this.util.each(dependencies, function (dependency) {
                        if (!_this.dependency.exists(dependency)) {
                            fail(dependency);
                            result = false;
                        }
                    });
                    if (result) {
                        finish();
                    }

                    return result;
                },
                compile: function compile(dependencies) {
                    var result = {};

                    _this.util.each(dependencies, function (dependency) {
                        result[dependency] = _this.container[dependency].content;
                    });

                    return result;
                },
                exists: function exists(dependency) {
                    return _this.util.isDefined(_this.container[dependency]);
                },

                add: function add(name, dependencies, content) {
                    return _this.container[name] = {
                        dependencies: dependencies,
                        type: typeof content === "undefined" ? "undefined" : _typeof(content),
                        content: content
                    };
                }

            };
            _this.util = {
                each: function each(arr, fn) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        fn(arr[i], i);
                    }
                },
                eachObject: function eachObject(object, fn) {
                    var keys = Object.keys(object);
                    for (var i = 0, l = keys.length; i < l; i++) {
                        fn(object[keys[i]], i);
                    }
                },
                isDefined: function isDefined(val) {
                    return typeof val !== "undefined";
                },
                log: function log(name, type, msg) {
                    var str = "Chevron " + type + " in service " + name + ": " + msg;
                    if (type === "error") {
                        throw str;
                    } else {
                        console.log(str);
                    }
                }
            };
        }

        _createClass(Chevron, [{
            key: "service",
            value: function service(name) {
                var dependencies = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
                var content = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                var _this = this;

                _this.dependency.load(dependencies, function () {
                    if (!_this.dependency.exists(name)) {
                        _this.dependency.add(name, dependencies, content);
                    } else {
                        _this.util.log(name, "error", "service '" + name + "' already declared");
                    }
                }, function (missing) {
                    _this.util.log(name, "error", "dependency '" + missing + "' not found");
                });
            }
        }, {
            key: "access",
            value: function access(name) {
                var _this = this,
                    service = _this.container[name],
                    result = void 0;

                if (service.type === "function") {
                    result = service.content.bind(_this.dependency.compile(service.dependencies));
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
