'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// File is named "_index.ts" to avoid it being treated as a module index file.

/**
 * Checks if a value is undefined or null.
 *
 * @memberof Is
 * @since 1.0.0
 * @param {any} val Value to check.
 * @returns {boolean} If the value is nil.
 * @example
 * isNil(null)
 * // => true
 *
 * isNil(undefined)
 * // => true
 *
 * isNil(0)
 * // => false
 *
 * isNil("")
 * // => false
 */
const isNil = (val) => val == null;

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
        this.setType("service" /* SERVICE */, serviceBootstrapper);
        this.setType("factory" /* FACTORY */, factoryBootstrapper);
        this.setType("plain" /* PLAIN */, plainBootstrapper);
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
     * Set a new injectable on the chevron instance.
     *
     * @public
     * @param {string} type Type of the injectable.
     * @param {string[]} dependencies Array of dependency names.
     * @param {*} initializer Content of the injectable.
     * @param {*?} key Custom key of the injectable. If none is given, the initializer will be used.
     * @throws Error when the key already exists, or the type is invalid.
     */
    set(type, dependencies, initializer, key) {
        const effectiveKey = isNil(key) ? initializer : key;
        if (this.has(effectiveKey)) {
            throw new Error(`Key already exists: '${effectiveKey}'.`);
        }
        this.injectables.set(effectiveKey, this.createEntry(type, initializer, dependencies));
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
    resolveEntry(key, accessStack) {
        if (accessStack.has(key)) {
            throw new Error(`Circular dependencies found: '${[...accessStack, key].join("->")}'.`);
        }
        if (!this.has(key)) {
            throw new Error(`Injectable '${key}' does not exist.`);
        }
        const entry = this.injectables.get(key);
        if (isNil(entry.content)) {
            accessStack.add(key);
            this.bootstrap(entry, accessStack);
            accessStack.delete(key);
        }
        return entry.content;
    }
    bootstrap(entry, accessStack) {
        const constructedDependencies = entry.dependencies.map(dependencyName => this.resolveEntry(dependencyName, accessStack));
        entry.content = entry.typeBootstrapper(entry.initializer, constructedDependencies);
    }
    createEntry(type, initializer, dependencies) {
        if (!this.hasType(type)) {
            throw new Error(`Missing type '${type}'.`);
        }
        return {
            typeBootstrapper: this.types.get(type),
            dependencies,
            initializer,
            content: null
        };
    }
}

exports.Chevron = Chevron;
