import { isFunction } from "lodash";
const functionBootstrapper = (initializer, dependencies) => (...args) => {
    if (!isFunction(initializer)) {
        throw new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");
    }
    return initializer(...dependencies, ...args);
};
export { functionBootstrapper };
//# sourceMappingURL=functionBootstrapper.js.map