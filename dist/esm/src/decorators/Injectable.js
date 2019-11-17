import { DefaultBootstrappings } from "../bootstrap/DefaultBootstrappings";
import { DefaultScopes } from "../scope/DefaultScopes";
const Injectable = (instance, bootstrapping = DefaultBootstrappings.IDENTITY, dependencies = [], name = null, scope = DefaultScopes.SINGLETON) => (target) => {
    instance.registerInjectable(target, bootstrapping, dependencies, name, scope);
    return target;
};
export { Injectable };
//# sourceMappingURL=Injectable.js.map