'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Built-in factory bootstrapper.
 *
 * @private
 */
const factoryBootstrapper = (content, dependencies) => Reflect.construct(content, dependencies);

/**
 * Built-in plain bootstrapper.
 *
 * @private
 */
const plainBootstrapper = (content) => content;

/**
 * Built-in service bootstrapper.
 *
 * @private
 */
const serviceBootstrapper = (content, dependencies) => 
// tslint:disable-next-line:only-arrow-functions
function () {
    return content(...dependencies, ...arguments);
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
     * @param {string} name Name of the injectable to get.
     * @returns {*} Bootstrapped content of the injectable.
     * @throws Error when the name cannot be found, or circular dependencies exist.
     */
    get(name) {
        return this.resolveEntry(name, new Set());
    }
    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {string} name Name of the injectable to check.
     * @returns {boolean} If the chevron instance has a given injectable.
     */
    has(name) {
        return this.injectables.has(name);
    }
    /**
     * Set a new injectable on the chevron instance.
     *
     * @public
     * @param {string} name Name of the injectable.
     * @param {string} type Type of the injectable.
     * @param {string[]} dependencies Array of dependency names.
     * @param {*} content Content of the injectable.
     */
    set(name, type, dependencies, content) {
        this.injectables.set(name, this.createEntry(type, content, dependencies));
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
    resolveEntry(name, accessStack) {
        if (accessStack.has(name)) {
            throw new Error(`Circular dependencies were found: '${[
                ...accessStack,
                name
            ].join("->")}'.`);
        }
        if (!this.has(name)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }
        const entry = this.injectables.get(name);
        if (!entry.isBootstrapped) {
            accessStack.add(name);
            entry.bootstrap(accessStack);
            accessStack.delete(name);
        }
        return entry.content;
    }
    createEntry(type, content, dependencies) {
        if (!this.hasType(type)) {
            throw new Error(`Missing type '${type}'.`);
        }
        const typeBootstrapper = this.types.get(type);
        const entry = {
            isBootstrapped: false,
            content,
            bootstrap: (accessStack) => {
                const constructedDependencies = dependencies.map(dependencyName => this.resolveEntry(dependencyName, accessStack));
                entry.content = typeBootstrapper(entry.content, constructedDependencies);
                entry.isBootstrapped = true;
            }
        };
        return entry;
    }
}

exports.Chevron = Chevron;
