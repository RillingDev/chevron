/*
esQuery v1.0.3

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
    //Shorthands for compression
    var _window = window,
        _document = document,
        _getElementById = _document.getElementById;

    /*--------------------------------------------------------------------------*/
    /**
     * esQuery Core
     *     > Base
     */

    /**
     * Calls esQuery constructor
     *
     * @param {selector} string/domElement to query.
     * @param {context} the context where to query, defaults to documeon.
     * @returns constructed esQuery object.
     */
    window.$ = function (selector, context) {
        return new esQuery(selector, context);
    };

    /**
     * The main esQuery class
     */
    window.esQuery = function () {
        /**
         *     > QueryEngine
         */

        /**
         * selects dom based on selector
         *
         * @param see '$'.
         * @returns constructed esQuery object.
         */

        function _class(selector, context) {
            _classCallCheck(this, _class);

            if (typeof selector === "string") {
                /*_this.query = {
                    selector: selector,
                    context: context
                };*/

                /**
                 * creates dom if domString is supplied
                 * @private
                 * @param {selector} domString.
                 * @returns constructed domElement.
                 */

                var _createDOM = function _createDOM(selector) {
                    var element = _document.createElement("div");
                    element.innerHTML = selector;
                    return [element.firstChild];
                };

                /**
                 * query dom if selectorString is supplied
                 * @private
                 * @param see '$'.
                 * @returns constructed domElement.
                 */


                var _queryDOM = function _queryDOM(selector, context) {
                    var testId = /^#\w+$/,
                        testClass = /^\.\w+$/,
                        testTag = /^\w+$/;
                    var result = [];

                    //Check if "context" exists, if not make it "document"
                    context = typeof context === "string" ? _getElementById(context.replace("#", "")) || _document : _document;

                    //Select via fitting selector (id,class,tag or query)
                    if (testId.test(selector)) {
                        result.push(context.getElementById(selector.replace("#", "")));
                    } else if (testClass.test(selector)) {
                        result = context.getElementsByClassName(selector.replace(".", ""));
                    } else if (testTag.test(selector)) {
                        result = context.getElementsByTagName(selector);
                    } else {
                        result = context.querySelectorAll(selector);
                    }

                    return result;
                };

                var testDOM = /^<.+>$/;
                var _this = this,
                    matches = [];

                if (selector.search(testDOM) > -1) {
                    matches = _createDOM(selector);
                } else {
                    matches = _queryDOM(selector, context);
                }

                //return results
                if (matches.length) {
                    _this.length = matches.length;
                    for (var i = 0; i < matches.length; i++) {
                        _this[i] = matches[i];
                    }
                }
            } else {
                return false;
            }
        }

        /*--------------------------------------------------------------------------*/
        /**
         * esQuery Methods
         *     > fn
         */

        /**
         * returns basic 'each' function
         *
         * @param {Function} the function to execute.
         * @returns esQuery object.
         */


        _createClass(_class, [{
            key: "x",
            value: function x(fn) {
                return this.each(function (element) {
                    fn(element);
                });
            }

            /**
             * returns 'if argument then loop fn ; else fn' function
             *
             * @param {Function} the function to execute.
             * @returns esQuery object.
             */

        }, {
            key: "y",
            value: function y(val, fn1, fn2) {
                return typeof val !== "undefined" ? this.each(function (element) {
                    fn1(element);
                }) : fn2(this[0]);
            }

            /**
             *     > Utility
             */

            /**
             * Iterates over domNode
             *
             * @param {Function} the function to execute.
             * @returns esQuery object.
             */

        }, {
            key: "each",
            value: function each(fn) {
                var _this = this;
                //"forEach" is more fitting but "for" is waaaay faster
                for (var i = 0; i < _this.length; i++) {
                    fn(_this[i], i);
                }
                return _this;
            }

            /**
             * returns vanilla nodeList from esQuery object
             *
             * @returns nodeList.
             */

        }, {
            key: "get",
            value: function get() {
                var list = [];
                this.x(function (element) {
                    list.push(element);
                });
                return list;
            }

            /**
             *     > Events
             */

            /**
             * bind event to current event
             *
             * @param {type} addEventListener event type
             * @param {fn} event callback
             * @param {capture} addEventListener capture boolean
             * @returns esQuery object.
             */

        }, {
            key: "on",
            value: function on(type, fn, capture) {
                return this.x(function (element) {
                    element.addEventListener(type, fn, capture || false);
                });
            }

            /**
             * remove event from element
             *
             * @param {type} addEventListener event type
             * @param {fn} event callback
             * @param {capture} addEventListener capture boolean
             * @returns esQuery object.
             */

        }, {
            key: "off",
            value: function off(type, fn, capture) {
                return this.x(function (element) {
                    element.removEventListener(type, fn, capture || false);
                });
            }

            /**
             * add custom Event to esQuery
             *
             * @param {name} name of the custom event
             * @param {type} event type, revertws to name
             * @returns esQuery object.
             */

        }, {
            key: "addCustomEvent",
            value: function addCustomEvent(name) {
                var type = arguments.length <= 1 || arguments[1] === undefined ? name : arguments[1];

                return esQuery.prototype[name] = this.on;
            }

            //4) DOM Manipulation
            //General

        }, {
            key: "append",
            value: function append(string) {
                return this.x(function (element) {
                    element.innerHTML += string;
                });
            }
        }, {
            key: "prepend",
            value: function prepend(string) {
                return this.x(function (element) {
                    element.innerHTML = string + element.innerHTML;
                });
            }
        }, {
            key: "remove",
            value: function remove() {
                return this.x(function (element) {
                    element.parentNode.removeChild(element);
                });
            }
        }, {
            key: "empty",
            value: function empty() {
                return this.x(function (element) {
                    element.innerHTML = "";
                });
            }

            //Content

        }, {
            key: "html",
            value: function html(string) {
                return this.y(string, function (element) {
                    element.innerHTML = string;
                }, function (element) {
                    return element.innerHTML;
                });
            }
        }, {
            key: "text",
            value: function text(string) {
                return this.y(string, function (element) {
                    element.textContent = string;
                }, function (element) {
                    return element.textContent;
                });
            }
        }, {
            key: "val",
            value: function val(value) {
                return this.y(value, function (element) {
                    element.value = value;
                }, function (element) {
                    return element.value;
                });
            }

            //Atributes

        }, {
            key: "attr",
            value: function attr(attribute, value) {
                return this.y(value, function (element) {
                    element.setAttribute(attribute, value);
                }, function (element) {
                    return element.getAttribute(attribute);
                });
            }
        }, {
            key: "data",
            value: function data(name, value) {
                return this.y(value, function (element) {
                    element.dataset[name] = value;
                }, function (element) {
                    return element.dataset[name];
                });
            }
        }, {
            key: "css",
            value: function css(property, value) {
                return this.y(value, function (element) {
                    element.style[property] = value;
                }, function (element) {
                    return element.style[property];
                });
            }
        }, {
            key: "getComputedStyle",
            value: function getComputedStyle(property) {
                return this.x(function (element) {
                    return document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
                });
            }
        }, {
            key: "height",
            value: function height(value) {
                return this.y(value, function (element) {
                    element.style.height = typeof value === "string" ? value : value + "px";
                }, function (element) {
                    return parseInt(document.defaultView.getComputedStyle(element, null).getPropertyValue("height"));
                });
            }
        }, {
            key: "width",
            value: function width(value) {
                return this.y(value, function (element) {
                    element.style.width = typeof value === "string" ? value : value + "px";
                }, function (element) {
                    return parseInt(document.defaultView.getComputedStyle(element, null).getPropertyValue("width"));
                });
            }
        }, {
            key: "show",
            value: function show() {
                return this.x(function (element) {
                    element.style.display = "inherit";
                });
            }
        }, {
            key: "hide",
            value: function hide() {
                return this.x(function (element) {
                    element.style.display = "none";
                });
            }
        }, {
            key: "addClass",
            value: function addClass(className) {
                return this.x(function (element) {
                    element.classList.add(className);
                });
            }
        }, {
            key: "removeClass",
            value: function removeClass(className) {
                return this.x(function (element) {
                    element.classList.remove(className);
                });
            }
        }, {
            key: "toggleClass",
            value: function toggleClass(className) {
                return this.x(function (element) {
                    if (element.classList.find(className)) {
                        element.classList.remove(className);
                    } else {
                        element.classList.add(className);
                    }
                });
            }
        }, {
            key: "hasClass",
            value: function hasClass(className) {
                return this.x(function (element) {
                    element.classList.find(className);
                });
            }
        }]);

        return _class;
    }();
    /*--------------------------------------------------------------------------*/
    /**
     * esQuery Postsetup
     *     > evManager
     */
    function initEvents() {
        var events = ["load", "click", "change", "focus", "blur"];
        for (var i = 0; i < events.length; i++) {
            esQuery.prototype.addCustomEvent(events[i]);
        }
        esQuery.prototype.addCustomEvent("ready", "DOMContentLoaded");
    }
    initEvents();
})(window);
//# sourceMappingURL=esQuery-es5.js.map
