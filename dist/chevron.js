/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/*
	chiffonjs v3.0.0
	
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
	
	    window.Chiffon = function () {
	        function _class(name) {
	            _classCallCheck(this, _class);
	
	            var _this = this;
	
	            _this.name = name || "cf";
	
	            _this.container = {};
	
	            /*####################/
	            * Internal Chevron methods
	            /####################*/
	            _this.$c = {
	                //add new service
	
	                add: function add(name, dependencyList, type, fn, args) {
	                    var service = _this.container[name] = {
	                        name: name,
	                        type: type,
	                        dependencies: dependencyList || [],
	                        fn: fn,
	                        initialized: false
	                    };
	                    //Add type specific props
	                    if (type === "factory") {
	                        service.args = args || [];
	                    }
	                },
	
	                //Check i status/d and issues iialize
	                prepare: function prepare(service) {
	                    var list = {};
	
	                    _this.$c.recurseDependencies(service.dependencies, function (dependency) {
	                        list[dependency.name] = _this.$c.bundle(dependency, list).fn;
	                    }, function (name) {
	                        throw _this.name + ": error in " + service.name + ": dependency '" + name + "' is missing";
	                    });
	
	                    return _this.$c.bundle(service, list);
	                },
	
	                //Iterate deps
	                recurseDependencies: function recurseDependencies(dependencyList, fn, error) {
	                    _this.$u.each(dependencyList, function (name) {
	                        if (_this.$c.exists(name)) {
	                            var service = _this.$c.get(name);
	
	                            if (service.dependencies.length > 0) {
	                                //recurse
	                                _this.$c.recurseDependencies(service.dependencies, fn, error);
	                            }
	                            fn(service);
	                        } else {
	                            error(n);
	                        }
	                    });
	                },
	                bundle: function bundle(service, list) {
	                    var bundle = [];
	
	                    _this.$u.eachObject(list, function (item, key) {
	                        if (service.dependencies.indexOf(key) !== -1) {
	                            bundle.push(item);
	                        }
	                    });
	
	                    if (!service.initialized) {
	                        return _this.$c.initialize(service, Array.from(bundle));
	                    } else {
	                        return service;
	                    }
	                },
	
	
	                //construct service/factory
	                initialize: function initialize(service, bundle) {
	                    if (service.type === "service") {
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
	
	                    service.initialized = true;
	                    return service;
	                },
	                exists: function exists(name) {
	                    return typeof _this.$c.get(name) !== "undefined";
	                },
	                get: function get(name) {
	                    return _this.container[name];
	                }
	            };
	            /*####################/
	            * Internal Utility methods
	            /####################*/
	            _this.$u = {
	                //Iterate
	
	                each: function each(arr, fn) {
	                    for (var i = 0, l = arr.length; i < l; i++) {
	                        fn(arr[i], i);
	                    }
	                },
	                eachObject: function eachObject(object, fn) {
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
	            value: function provider(name, dependencyList, fn, type, args) {
	                var _this = this;
	
	                if (_this.$c.exists(name)) {
	                    throw _this.name + ": error in " + type + ": service '" + name + "' is already defined";
	                } else {
	                    _this.$c.add(name, dependencyList, type, fn, args);
	
	                    return _this;
	                }
	            }
	            //create new service
	
	        }, {
	            key: "service",
	            value: function service(name, dependencyList, fn) {
	                return this.provider(name, dependencyList, fn, "service");
	            }
	            //create new factory
	
	        }, {
	            key: "factory",
	            value: function factory(name, dependencyList, Constructor, args) {
	                return this.provider(name, dependencyList, Constructor, "factory", args);
	            }
	            //prepare/iialize services/factory with d injected
	
	        }, {
	            key: "access",
	            value: function access(name) {
	                var _this = this;
	
	                //Check if accessed service is registered
	                if (_this.$c.exists(name)) {
	                    return _this.$c.prepare(_this.$c.get(name)).fn;
	                } else {
	                    throw _this.name + ": error accessing " + name + ": '" + name + "' is not defined";
	                }
	            }
	        }]);
	
	        return _class;
	    }();
	})(window);

/***/ }
/******/ ]);
//# sourceMappingURL=chevron.js.map