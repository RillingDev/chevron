import { isFunction } from "lodash";

const createNonFunctionInitializerError = (): TypeError =>
    new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");

const classBootstrapper = <TValue, UInitializer, VDependency>(
    initializer: UInitializer,
    dependencies: VDependency[]
): TValue => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }

    return Reflect.construct(initializer, dependencies);
};

const functionBootstrapper = <TValue, UInitializer, VDependency>(
    initializer: UInitializer,
    dependencies: VDependency[]
) => (...args: any[]) => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }

    return initializer(...dependencies, ...args);
};

const identityBootstrapper = <TInitializer>(
    initializer: TInitializer
): TInitializer => initializer;

const DefaultBootstrappers = {
    CLASS: classBootstrapper,
    FUNCTION: functionBootstrapper,
    IDENTITY: identityBootstrapper
};

export { DefaultBootstrappers };
