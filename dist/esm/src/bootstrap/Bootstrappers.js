import { isFunction } from "lodash";
const createNonFunctionInitializerError = () => new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");
const classBootstrapper = (initializer, dependencies) => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }
    return Reflect.construct(initializer, dependencies);
};
const functionBootstrapper = (initializer, dependencies) => (...args) => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }
    return initializer(...dependencies, ...args);
};
const identityBootstrapper = (initializer) => initializer;
const Bootstrappers = {
    CLASS: classBootstrapper,
    FUNCTION: functionBootstrapper,
    IDENTITY: identityBootstrapper
};
export { Bootstrappers };
//# sourceMappingURL=Bootstrappers.js.map