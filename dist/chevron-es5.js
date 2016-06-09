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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    var Chevron = function () {
        function Chevron() {
            _classCallCheck(this, Chevron);

            var _this = this;
            _this.container = {};
            _this.register = {
                load: function load(dependencies, finish, fail) {
                    var result = true;

                    _this.util.each(dependencies, function (dependency) {
                        if (!_this.register.exists(dependency)) {
                            fail(dependency);
                            result = false;
                        }
                    });
                    if (result) {
                        finish();
                    }

                    return result;
                },
                exists: function exists(dependency) {
                    return _this.util.isDefined(_this.container[dependency]);
                },

                add: function add(name, content) {
                    return _this.container[name] = content;
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

                _this.register.load(dependencies, function () {
                    if (!_this.register.exists(name)) {
                        _this.register.add(name, content);
                    } else {
                        _this.util.log(name, "error", "service '" + name + "' already declared");
                    }
                }, function (missing) {
                    _this.util.log(name, "error", "dependency '" + missing + "' not found");
                });
            }
        }]);

        return Chevron;
    }();

    window.Chevron = Chevron;
})(window);
//# sourceMappingURL=chevron-es5.js.map
