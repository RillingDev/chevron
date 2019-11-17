import { DefaultBootstrappers } from "../bootstrap/DefaultBootstrappers";
const Injectable = (instance, bootstrapFn = DefaultBootstrappers.IDENTITY, dependencies = [], name = null) => (target) => {
    instance.register(target, bootstrapFn, dependencies, name);
    return target;
};
export { Injectable };
//# sourceMappingURL=Injectable.js.map