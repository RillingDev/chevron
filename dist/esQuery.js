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

(function(window) {
    //Shorthands for compression
    const _window = window,
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
    window.$ = function(selector, context) {
        return new esQuery(selector, context);
    }

    /**
     * The main esQuery class
     */
    window.esQuery = class {
        /**
         *     > QueryEngine
         */

        /**
         * selects dom based on selector
         *
         * @param see '$'.
         * @returns constructed esQuery object.
         */
        constructor(selector, context) {
            if (typeof selector === "string") {
                const testDOM = /^<.+>$/;
                let _this = this,
                    matches = [];

                if (selector.search(testDOM) > -1) {
                    matches = createDOM(selector);
                } else {
                    matches = queryDOM(selector, context);
                }

                //return results
                if (matches.length) {
                    _this.length = matches.length;
                    for (var i = 0; i < matches.length; i++) {
                        _this[i] = matches[i];
                    }
                }
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
                function createDOM(selector) {
                    let element = _document.createElement("div");
                    element.innerHTML = selector;
                    return [element.firstChild];
                }

                /**
                 * query dom if selectorString is supplied
                 * @private
                 * @param see '$'.
                 * @returns constructed domElement.
                 */
                function queryDOM(selector, context) {
                    const testId = /^#\w+$/,
                        testClass = /^\.\w+$/,
                        testTag = /^\w+$/;
                    let result = [];

                    //Check if "context" exists, if not make it "document"
                    context = (
                        typeof context === "string" ?
                        (_getElementById(context.replace("#", "")) || _document) :
                        _document
                    );

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
        x(fn) {
            return (this.each(element => {
                fn(element);
            }));
        }

        /**
         * returns 'if argument then loop fn ; else fn' function
         *
         * @param {Function} the function to execute.
         * @returns esQuery object.
         */
        y(val, fn1, fn2) {
            return (typeof val !== "undefined") ?
                (this.each(element => {
                    fn1(element);
                })) :
                (fn2(this[0]));
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
        each(fn) {
            let _this = this;
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
        get() {
            let list = [];
            this.x(element => {
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
        on(type, fn, capture) {
            return this.x(element => {
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
        off(type, fn, capture) {
            return this.x(element => {
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
        addCustomEvent(name, type = name) {
            return esQuery.prototype[name] = this.on;
        }

        //4) DOM Manipulation
        //General
        append(string) {
            return this.x(element => {
                element.innerHTML += string;
            });
        }

        prepend(string) {
            return this.x(element => {
                element.innerHTML = string + element.innerHTML;
            });
        }

        remove() {
            return this.x(element => {
                element.parentNode.removeChild(element);
            });
        }

        empty() {
            return this.x(element => {
                element.innerHTML = "";
            });
        }

        //Content
        html(string) {
            return this.y(string, element => {
                element.innerHTML = string;
            }, element => {
                return element.innerHTML;
            });
        }

        text(string) {
            return this.y(string, element => {
                element.textContent = string;
            }, element => {
                return element.textContent;
            });
        }

        val(value) {
            return this.y(value, element => {
                element.value = value;
            }, element => {
                return element.value;
            });
        }

        //Atributes
        attr(attribute, value) {
            return this.y(value, element => {
                element.setAttribute(attribute, value);
            }, element => {
                return element.getAttribute(attribute);
            });
        }
        data(name, value) {
            return this.y(value, element => {
                element.dataset[name] = value;
            }, element => {
                return element.dataset[name];
            });
        }
        css(property, value) {
            return this.y(value, element => {
                element.style[property] = value;
            }, element => {
                return element.style[property];
            });
        }

        getComputedStyle(property) {
            return this.x(element => {
                return document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
            });
        }

        height(value) {
            return this.y(value, element => {
                element.style.height = typeof value === "string" ? value : value + "px";
            }, element => {
                return parseInt(document.defaultView.getComputedStyle(element, null).getPropertyValue("height"));
            });
        }

        width(value) {
            return this.y(value, element => {
                element.style.width = typeof value === "string" ? value : value + "px";
            }, element => {
                return parseInt(document.defaultView.getComputedStyle(element, null).getPropertyValue("width"));
            });
        }

        show() {
            return this.x(element => {
                element.style.display = "inherit";
            });
        }
        hide() {
            return this.x(element => {
                element.style.display = "none";
            });
        }

        addClass(className) {
            return this.x(element => {
                element.classList.add(className);
            });
        }

        removeClass(className) {
            return this.x(element => {
                element.classList.remove(className);
            });
        }

        toggleClass(className) {
            return this.x(element => {
                if (element.classList.find(className)) {
                    element.classList.remove(className);
                } else {
                    element.classList.add(className);
                }
            });
        }

        hasClass(className) {
            return this.x(element => {
                element.classList.find(className);
            });
        }

    };
    /*--------------------------------------------------------------------------*/
    /**
     * esQuery Postsetup
     *     > evManager
     */
    function initEvents() {
        const events = ["load", "click", "change", "focus", "blur"];
        for (var i = 0; i < events.length; i++) {
            esQuery.prototype.addCustomEvent(events[i]);
        }
        esQuery.prototype.addCustomEvent("ready", "DOMContentLoaded");
    }
    initEvents();

})(window);
