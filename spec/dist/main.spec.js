'use strict';

var lodash = require('lodash');

/**
 * Built-in factory bootstrapper.
 *
 * @private
 */
const factoryBootstrapper = (initializer, dependencies) => Reflect.construct(initializer, dependencies);

/**
 * Built-in plain bootstrapper.
 *
 * @private
 */
const plainBootstrapper = (initializer) => initializer;

/**
 * Built-in service bootstrapper.
 *
 * @private
 */
const serviceBootstrapper = (initializer, dependencies) => 
// tslint:disable-next-line:only-arrow-functions
function () {
    return initializer(...dependencies, ...arguments);
};

class Chevron {
    /**
     * Main chevron class.
     *
     * @public
     * @class Chevron
     */
    constructor() {
        this.types = new Map();
        this.setType("plain" /* PLAIN */, plainBootstrapper);
        this.setType("service" /* SERVICE */, serviceBootstrapper);
        this.setType("factory" /* FACTORY */, factoryBootstrapper);
        this.injectables = new Map();
    }
    /**
     * Gets a bootstrapped injectable from the chevron instance.
     *
     * @public
     * @param {*} key Key of the injectable to get.
     * @returns {*} Bootstrapped content of the injectable.
     * @throws Error when the key cannot be found, or circular dependencies exist.
     */
    get(key) {
        return this.resolveEntry(key, new Set());
    }
    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {*} key Key of the injectable to check.
     * @returns {boolean} If the chevron instance has a given injectable.
     */
    has(key) {
        return this.injectables.has(key);
    }
    /**
     * Sets a new injectable on the chevron instance.
     *
     * @public
     * @param {string} type Type of the injectable.
     * @param {string[]} dependencies Array of dependency keys.
     * @param {*} initializer Content of the injectable.
     * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
     * @throws Error when the key already exists, or the type is invalid.
     */
    set(type, dependencies, initializer, key) {
        if (!this.hasType(type)) {
            throw new Error(`Missing type '${type}'.`);
        }
        /*
         * Infer the key from the initializer only if no key was explicitly given.
         */
        const effectiveKey = lodash.isNil(key) ? initializer : key;
        if (this.has(effectiveKey)) {
            throw new Error(`Key already exists: '${effectiveKey}'.`);
        }
        this.injectables.set(effectiveKey, {
            typeBootstrapper: this.types.get(type),
            dependencies,
            initializer,
            content: null
        });
    }
    /**
     * Checks if the chevron instance has a given injectable type.
     *
     * @public
     * @param {string} name Name of the injectable type to check.
     * @returns {boolean} If the chevron instance has a given injectable type.
     */
    hasType(name) {
        return this.types.has(name);
    }
    /**
     * Sets a type of injectables.
     *
     * @public
     * @param {string} name Name of the type.
     * @param {function} bootstrapperFn Bootstrap function for injectables of this type.
     */
    setType(name, bootstrapperFn) {
        this.types.set(name, bootstrapperFn);
    }
    /**
     * Resolves an entry by its key, keeping track of the access stack.
     *
     * @private
     */
    resolveEntry(key, accessStack) {
        if (!this.has(key)) {
            throw new Error(`Injectable '${key}' does not exist.`);
        }
        const entry = this.injectables.get(key);
        if (lodash.isNil(entry.content)) {
            /*
             * Entry is not constructed, recursively bootstrap dependencies and the entry itself.
             */
            this.bootstrap(key, accessStack, entry);
        }
        return entry.content;
    }
    /**
     * Bootstraps an entry, keeping track of the access stack.
     *
     * @private
     */
    bootstrap(key, accessStack, entry) {
        /*
         * Check if we already tried accessing this injectable before; if we did, assume circular dependencies.
         */
        if (accessStack.has(key)) {
            throw new Error(`Circular dependencies found: '${[...accessStack, key].join("->")}'.`);
        }
        accessStack.add(key);
        entry.content = entry.typeBootstrapper(entry.initializer, entry.dependencies.map(dependencyName => this.resolveEntry(dependencyName, accessStack)));
        accessStack.delete(key);
    }
}

describe("Chevron tests", () => {
    it("Asserts that Chevron#get throws an exception for missing injectables", () => {
        expect(() => new Chevron().get("foo")).toThrow();
    });
    it("Asserts that Chevron#set throws an exception when using a duplicate key", () => {
        const cv = new Chevron();
        const key = "foo";
        cv.set("service" /* SERVICE */, [], 123, key);
        expect(() => cv.set("service" /* SERVICE */, [], 321, key)).toThrowError(/Key already exists.+/);
    });
    it("Asserts that Chevron#set throws an exception when using an unknown type", () => {
        expect(() => new Chevron().set("unknown", [], 123, "myUnknown")).toThrowError(/Missing type.+/);
    });
    it("Asserts that Chevron initialises with the types 'plain', 'service' and 'factory'", () => {
        const cv = new Chevron();
        expect(cv.hasType("plain" /* PLAIN */)).toBeTruthy();
        expect(cv.hasType("service" /* SERVICE */)).toBeTruthy();
        expect(cv.hasType("factory" /* FACTORY */)).toBeTruthy();
        expect(cv.hasType("unknown")).toBeFalsy();
    });
});

describe("factoryBootstrapper tests", () => {
    it("Asserts that factoryBootstrapper constructs a class", () => {
        const result = 123;
        class TestClass {
            constructor() {
                this.val = result;
            }
            getVal() {
                return this.val;
            }
        }
        expect(factoryBootstrapper(TestClass, []).getVal()).toBe(result);
    });
    it("Asserts that factoryBootstrapper constructs a class with dependencies", () => {
        const result = 123;
        class TestClass {
            constructor(val) {
                this.val = val;
            }
            // noinspection JSUnusedGlobalSymbols
            getVal() {
                return this.val;
            }
        }
        expect(factoryBootstrapper(TestClass, [result]).getVal()).toBe(result);
    });
});

describe("serviceBootstrapper tests", () => {
    it("Asserts that serviceBootstrapper returns the wrapper function", () => {
        const result = 123;
        const testFn = () => result;
        expect(serviceBootstrapper(testFn, [])()).toBe(result);
    });
    it("Asserts that serviceBootstrapper returns the wrapper function when used with dependencies", () => {
        const result = 123;
        const testFn = (val) => val;
        expect(serviceBootstrapper(testFn, [result])()).toBe(result);
    });
});

describe("Chevron API ITs", () => {
    it("Asserts that factories construct", () => {
        const cv = new Chevron();
        const MY_INJECTABLE_TYPE = "myType";
        cv.setType(MY_INJECTABLE_TYPE, (content, dependencies) => content * 2);
        const testInjectable = "testInjectable";
        const testVal = 123;
        cv.set(MY_INJECTABLE_TYPE, [], testVal, testInjectable);
        expect(cv.get(testInjectable)).toBe(246);
    });
});

/* tslint:disable:max-classes-per-file */
describe("Chevron ITs", () => {
    it("Asserts that an error is thrown when resolving circular dependencies", () => {
        const cv = new Chevron();
        const result = 123;
        const testFactoryName = "testFactoryName";
        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set("service" /* SERVICE */, [testFactoryName], testServiceFn, testServiceName);
        class TestFactoryClass {
            constructor(numberService) {
                this.numberService = numberService;
            }
            // noinspection JSUnusedGlobalSymbols
            getVal() {
                return this.numberService();
            }
        }
        cv.set("factory" /* FACTORY */, [testServiceName], TestFactoryClass, testFactoryName);
        expect(() => cv.get(testFactoryName)).toThrowError(/Circular dependencies found.+/);
    });
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

/**
 * Decorator function to be used as TypeScript decorator
 * in order to wire an injectable into a class property.
 *
 * @public
 * @param {Chevron} instance Chevron instance to use.
 * @param {*} key Key of the injectable.
 */
const Autowired = (instance, key) => (target, propertyKey) => {
    target[propertyKey] = instance.get(key);
};

/**
 * Decorator function to be used as TypeScript decorator
 * in order to declare a value to be an injectable which is added to the chevron instance.
 *
 * @param {Chevron} instance Chevron instance to use.
 * @param {string} type Type of the injectable.
 * @param {string[]} dependencies Array of dependency keys.
 * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
 */
const Injectable = (instance, type, dependencies, key) => (target) => {
    instance.set(type, dependencies, target, key);
    return target;
};

describe("Chevron Demo ITs", () => {
    it("Usage#1", () => {
        const logSpy = spyOn(console, "log");
        const cv = new Chevron(); // Create a new instance which acts as the container for the injectables
        /*
         * Classic API.
         */
        class MyFactory {
            sayHello() {
                console.log("Hello!");
            }
        }
        cv.set("factory" /* FACTORY */, // Type of the injectable.
        [], // Dependencies this injectable uses, none in this case.
        MyFactory // Content of the injectable. In this case, it will also be used as the key for accessing the injectable later.
        );
        cv.get(MyFactory).sayHello(); // Prints "Hello!"
        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });
    it("Usage#2", () => {
        const logSpy = spyOn(console, "log");
        const cv = new Chevron();
        /*
         * Decorator API.
         */
        let MyFactory = class MyFactory {
            sayHello() {
                console.log("Hello!");
            }
        };
        MyFactory = __decorate([
            Injectable(cv, "factory" /* FACTORY */, [])
        ], MyFactory);
        class ConsumerClass {
            run() {
                this.injectedMyFactory.sayHello();
            }
        }
        __decorate([
            Autowired(cv, MyFactory),
            __metadata("design:type", Object)
        ], ConsumerClass.prototype, "injectedMyFactory", void 0);
        new ConsumerClass().run(); // Prints "Hello!"
        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });
    it("Dependencies#1", () => {
        const logSpy = spyOn(console, "log");
        const cv = new Chevron(); // Create a new instance which acts as the container for the injectables
        class MyFactory {
            sayHello() {
                console.log("Hello!");
            }
        }
        cv.set("factory" /* FACTORY */, [], MyFactory);
        function myService(myFactory) {
            myFactory.sayHello();
        }
        cv.set("service" /* SERVICE */, [MyFactory], // Key of the dependency is listed here.
        myService);
        cv.get(myService)(); // Prints "Hello!"
        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });
    it("Keys#1", () => {
        const logSpy = spyOn(console, "log");
        const cv = new Chevron();
        class MyFactory {
            sayHello() {
                console.log("Hello!");
            }
        }
        cv.set("factory" /* FACTORY */, [], MyFactory, "myInjectableFactory1");
        cv.set("factory" /* FACTORY */, [], MyFactory, "myInjectableFactory2");
        cv.get("myInjectableFactory1").sayHello(); // Prints "Hello!"
        expect(logSpy).toHaveBeenCalledWith("Hello!");
    });
});

/* tslint:disable:max-classes-per-file */
describe("Chevron ITs", () => {
    it("Asserts that plains construct", () => {
        const cv = new Chevron();
        const result = 123;
        const testPlainName = "testPlainName";
        cv.set("plain" /* PLAIN */, [], result, testPlainName);
        expect(cv.get(testPlainName)).toBe(result);
    });
    it("Asserts that services construct", () => {
        const cv = new Chevron();
        const result = 123;
        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set("service" /* SERVICE */, [], testServiceFn, testServiceName);
        expect(cv.get(testServiceName)()).toBe(result);
    });
    it("Asserts that factories construct", () => {
        const cv = new Chevron();
        const result = 123;
        const testFactoryName = "testFactoryName";
        class TestFactoryClass {
            // noinspection JSMethodCanBeStatic
            getVal() {
                return result;
            }
        }
        cv.set("factory" /* FACTORY */, [], TestFactoryClass, testFactoryName);
        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });
    it("Asserts that single layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;
        const testServiceName = "testServiceName";
        const testServiceFn = () => result;
        cv.set("service" /* SERVICE */, [], testServiceFn, testServiceName);
        const testFactoryName = "testFactoryName";
        class TestFactoryClass {
            constructor(numberService) {
                this.numberService = numberService;
            }
            // noinspection JSUnusedGlobalSymbols
            getVal() {
                return this.numberService();
            }
        }
        cv.set("factory" /* FACTORY */, [testServiceName], TestFactoryClass, testFactoryName);
        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });
    it("Asserts that multi layer dependencies are resolved", () => {
        const cv = new Chevron();
        const result = 123;
        const testService1Name = "testService1Name";
        const testService1Fn = () => result;
        cv.set("service" /* SERVICE */, [], testService1Fn, testService1Name);
        const testFactoryName1 = "testFactoryName1";
        class TestFactoryClass1 {
            // noinspection JSMethodCanBeStatic
            isAllowed() {
                return true;
            }
        }
        cv.set("factory" /* FACTORY */, [], TestFactoryClass1, testFactoryName1);
        const testService2Name = "testService2Name";
        const testService2Fn = (testService1, testFactory1) => {
            if (!testFactory1.isAllowed()) {
                throw new Error("Oh no!");
            }
            return testService1();
        };
        cv.set("service" /* SERVICE */, [testService1Name, testFactoryName1], testService2Fn, testService2Name);
        const testFactoryName2 = "testFactoryName2";
        const TestFactoryClass2 = class {
            constructor(numberService) {
                this.numberService = numberService;
            }
            // noinspection JSUnusedGlobalSymbols
            getVal() {
                return this.numberService();
            }
        };
        cv.set("factory" /* FACTORY */, [testService2Name], TestFactoryClass2, testFactoryName2);
        expect(cv.get(testFactoryName2).getVal()).toBe(result);
    });
    it("Asserts that non-string keys construct", () => {
        const cv = new Chevron();
        const result = 123;
        class TestFactoryClass {
            // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
            getVal() {
                return result;
            }
        }
        cv.set("factory" /* FACTORY */, [], TestFactoryClass, TestFactoryClass);
        expect(cv.get(TestFactoryClass).getVal()).toBe(result);
    });
    it("Asserts that the key can be inferred from the initializer", () => {
        const cv = new Chevron();
        const result = 123;
        class TestFactoryClass {
            // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
            getVal() {
                return result;
            }
        }
        cv.set("factory" /* FACTORY */, [], TestFactoryClass);
        expect(cv.get(TestFactoryClass).getVal()).toBe(result);
    });
});

describe("Autowired tests", () => {
    it("Asserts that @Autowired works", () => {
        const cv = new Chevron();
        const result = 123;
        const testFactoryName = "testFactoryName";
        class TestFactoryClass {
            // noinspection JSMethodCanBeStatic
            getVal() {
                return result;
            }
        }
        cv.set("factory", [], TestFactoryClass, testFactoryName);
        class ConsumerClass {
            getVal() {
                return this.injectedDependency.getVal();
            }
        }
        __decorate([
            Autowired(cv, testFactoryName),
            __metadata("design:type", Object)
        ], ConsumerClass.prototype, "injectedDependency", void 0);
        expect(new ConsumerClass().getVal()).toBe(result);
    });
    it("Asserts that @Autowired works with @Injectable", () => {
        const cv = new Chevron();
        const result = 123;
        const testFactoryName = "testFactoryName";
        let TestFactoryClass = class TestFactoryClass {
            // noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
            getVal() {
                return result;
            }
        };
        TestFactoryClass = __decorate([
            Injectable(cv, "factory" /* FACTORY */, [], testFactoryName)
        ], TestFactoryClass);
        class ConsumerClass {
            getVal() {
                return this.injectedDependency.getVal();
            }
        }
        __decorate([
            Autowired(cv, testFactoryName),
            __metadata("design:type", Object)
        ], ConsumerClass.prototype, "injectedDependency", void 0);
        expect(new ConsumerClass().getVal()).toBe(result);
    });
});

describe("Injectable tests", () => {
    it("Asserts that @Injectable works", () => {
        const cv = new Chevron();
        const result = 123;
        const testFactoryName = "testFactoryName";
        let TestFactoryClass = class TestFactoryClass {
            // noinspection JSMethodCanBeStatic
            getVal() {
                return result;
            }
        };
        TestFactoryClass = __decorate([
            Injectable(cv, "factory" /* FACTORY */, [], testFactoryName)
        ], TestFactoryClass);
        expect(cv.get(testFactoryName).getVal()).toBe(result);
    });
    it("Asserts that @Injectable can infer the name", () => {
        const cv = new Chevron();
        const result = 123;
        let TestFactoryClass = class TestFactoryClass {
            // noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
            getVal() {
                return result;
            }
        };
        TestFactoryClass = __decorate([
            Injectable(cv, "factory" /* FACTORY */, [])
        ], TestFactoryClass);
        class ConsumerClass {
            getVal() {
                return this.injectedDependency.getVal();
            }
        }
        __decorate([
            Autowired(cv, TestFactoryClass),
            __metadata("design:type", Object)
        ], ConsumerClass.prototype, "injectedDependency", void 0);
        expect(new ConsumerClass().getVal()).toBe(result);
    });
});
