import { identityBootstrapper } from "../bootstrap/identityBootstrapper";
/**
 * Decorator function to be used as TypeScript decorator
 * in order to declare a value to be an injectable which is added to the chevron instance.
 *
 * @param {Chevron} instance Chevron instance to use.
 * @param {string[]} dependencies Array of dependency keys.
 */
const Injectable = (instance, bootstrapFn = identityBootstrapper, dependencies = [], name = null) => (target) => {
    instance.register(target, bootstrapFn, dependencies, name);
    return target;
};
export { Injectable };
//# sourceMappingURL=Injectable.js.map