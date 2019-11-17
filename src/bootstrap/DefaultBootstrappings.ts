import { isFunction } from "lodash";

const createNonFunctionInitializerError = (): TypeError =>
    new TypeError("Non-functions cannot be bootstrapped by this bootstrapper.");

const classBootstrapping = <TValue, UInitializer, VDependency>(
    initializer: UInitializer,
    dependencies: VDependency[]
): TValue => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }

    return Reflect.construct(initializer, dependencies);
};

const functionBootstrapping = <TValue, UInitializer, VDependency>(
    initializer: UInitializer,
    dependencies: VDependency[]
) => (...args: any[]) => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }

    return initializer(...dependencies, ...args);
};

const identityBootstrapping = <TInitializer>(
    initializer: TInitializer
): TInitializer => initializer;

const DefaultBootstrappings = {
    CLASS: classBootstrapping,
    FUNCTION: functionBootstrapping,
    IDENTITY: identityBootstrapping
};

export { DefaultBootstrappings };
