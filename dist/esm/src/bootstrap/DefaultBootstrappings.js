import { isFunction } from "lodash";
const createNonFunctionInitializerError = () => new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");
const classBootstrapping = (initializer, dependencies) => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }
    return Reflect.construct(initializer, dependencies);
};
const functionBootstrapping = (initializer, dependencies) => (...args) => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }
    return initializer(...dependencies, ...args);
};
const identityBootstrapping = (initializer) => initializer;
const DefaultBootstrappings = {
    CLASS: classBootstrapping,
    FUNCTION: functionBootstrapping,
    IDENTITY: identityBootstrapping
};
export { DefaultBootstrappings };
//# sourceMappingURL=DefaultBootstrappings.js.map