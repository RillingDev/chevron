import { Bootstrappers } from "../bootstrap/Bootstrappers";
import { Scopes } from "../scope/Scopes";
const Injectable = (instance, bootstrapFn = Bootstrappers.IDENTITY, dependencies = [], name = null, scopeFn = Scopes.SINGLETON) => (target) => {
    instance.register(target, bootstrapFn, dependencies, name, scopeFn);
    return target;
};
export { Injectable };
//# sourceMappingURL=Injectable.js.map