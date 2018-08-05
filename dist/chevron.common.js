'use strict';

const factoryConstructorFn = (content, dependencies) => new (Function.prototype.bind.apply(content, ["", ...dependencies]))();

const serviceConstructorFn = (content, dependencies) => 
// tslint:disable-next-line:only-arrow-functions
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
    has(id) {
        return this._.has(id);
    }
    get(id) {
        if (!this.has(id)) {
            return null;
        }
        const entry = this._.get(id);
        return entry[0] ? entry[1] : entry[2]();
    }
};

module.exports = Chevron;
