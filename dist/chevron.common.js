'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Built-in factoryBootstrapper constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const factoryBootstrapper = (content, dependencies) => Reflect.construct(content, dependencies);

/**
 * Built-in plainBootstrapper constructor.
 *
 * @private
 * @param {*} content
 */
const plainBootstrapper = (content) => content;

/**
 * Built-in serviceBootstrapper constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const serviceBootstrapper = (content, dependencies) => 
// tslint:disable-next-line:only-arrow-functions
function () {
    return content(...dependencies, ...arguments);
};

class Chevron {
    /**
     * Main Chevron class.
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
     * Set a new injectable on the chevron instance.
     *
     * @public
     * @param {string} name
     * @param {string} type
     * @param {string[]} dependencies
     * @param {*} content
     */
    set(name, type, dependencies, content) {
        this.injectables.set(name, this.createEntry(type, content, dependencies));
    }
    /**
     * Checks if the chevron instance has a given injectable.
     *
     * @public
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.injectables.has(name);
    }
    /**
     * Gets a bootstrapped injectable from the chevron instance.
     *
     * @public
     * @param {string} name
     * @returns {*}
     */
    get(name) {
        return this.resolveEntry(name);
    }
    setType(name, bootstrapperFn) {
        this.types.set(name, bootstrapperFn);
    }
    hasType(name) {
        return this.types.has(name);
    }
    createEntry(type, content, dependencies) {
        if (!this.hasType(type)) {
            throw new Error(`Missing type '${type}'.`);
        }
        const bootstrapperFn = this.types.get(type);
        const entry = {
            isBootstrapped: false,
            content,
            bootstrap: () => {
                const constructedDependencies = dependencies.map(dependencyName => this.get(dependencyName));
                entry.content = bootstrapperFn(entry.content, constructedDependencies);
                entry.isBootstrapped = true;
            }
        };
        return entry;
    }
    resolveEntry(name) {
        if (!this.has(name)) {
            throw new Error(`Injectable '${name}' does not exist.`);
        }
        const entry = this.injectables.get(name);
        if (!entry.isBootstrapped) {
            entry.bootstrap();
        }
        return entry.content;
    }
}

exports.Chevron = Chevron;
