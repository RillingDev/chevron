var Chevron = (function () {
    'use strict';

    const factoryConstructorFn = (content, dependencies) => {
        // Dereference array, because we dont wanna mutate the arg
        const dependenciesArr = Array.from(dependencies);
        // First value gets ignored by calling 'new' like this, so we need to fill it with something
        dependenciesArr.unshift("");
        // Apply into new constructor by binding applying the bind method.
        // @see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
        const contentNew = new (Function.prototype.bind.apply(content, dependenciesArr))();
        return contentNew;
    };

    const serviceConstructorFn = (content, dependencies) => 
    // tslint-ignore
    function () {
        return content(...dependencies, ...arguments);
    };

    const Chevron = class {
        constructor() {
            // Type map
            this.$ = new Map();
            // Content map
            this._ = new Map();
            this.$.set("service", serviceConstructorFn);
            this.$.set("factory", factoryConstructorFn);
        }
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
        get(id) {
            if (!this._.has(id)) {
                throw new Error(`Missing entry '${id}'.`);
            }
            const entry = this._.get(id);
            return entry[0] ? entry[1] : entry[2]();
        }
    };

    return Chevron;

}());
//# sourceMappingURL=chevron.js.map
