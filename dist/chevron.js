var Chevron = (function () {
    'use strict';

    /**
     * Built-in factory constructor.
     *
     * @private
     * @param {*} content
     * @param {Array<*>} dependencies
     */
    const factoryConstructorFn = (content, dependencies) => new (Function.prototype.bind.apply(content, ["", ...dependencies]))();

    /**
     * Built-in service constructor.
     *
     * @private
     * @param {*} content
     * @param {Array<*>} dependencies
     */
    const serviceConstructorFn = (content, dependencies) => 
    // tslint:disable-next-line:only-arrow-functions
    function () {
        return content(...dependencies, ...arguments);
    };

    const Chevron = class {
        /**
         * Main Chevron class.
         *
         * @public
         * @class Chevron
         */
        constructor() {
            // Type map
            this.$ = new Map();
            // Content map
            this._ = new Map();
            this.$.set("service", serviceConstructorFn);
            this.$.set("factory", factoryConstructorFn);
        }
        /**
         * Set a new entry on the content map.
         *
         * @public
         * @param {string} id
         * @param {string} type
         * @param {string[]} dependencies
         * @param {*} content
         */
        set(id, type, dependencies, content) {
            if (!this.$.has(type)) {
                throw new Error(`Missing type '${type}'.`);
            }
            const entry = [
                false,
                content,
                () => {
                    const dependenciesConstructed = dependencies.map(dependencyName => this.get(dependencyName));
                    entry[1] = this.$.get(type)(entry[1], dependenciesConstructed);
                    entry[0] = true;
                    return entry[1];
                }
            ];
            this._.set(id, entry);
        }
        /**
         * Checks if the content map has an entry.
         *
         * @public
         * @param {string} id
         * @returns {boolean}
         */
        has(id) {
            return this._.has(id);
        }
        /**
         * Gets an entry from the content map.
         *
         * @public
         * @param id {string} id
         * @returns {*}
         */
        get(id) {
            if (!this.has(id)) {
                return null;
            }
            const entry = this._.get(id);
            return entry[0] ? entry[1] : entry[2]();
        }
    };

    return Chevron;

}());
//# sourceMappingURL=chevron.js.map
