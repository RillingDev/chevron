import { isFunction } from "lodash";
const classBootstrapper = (initializer, dependencies) => {
    if (!isFunction(initializer)) {
        throw new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");
    }
    return Reflect.construct(initializer, dependencies);
};
export { classBootstrapper };
//# sourceMappingURL=classBootstrapper.js.map