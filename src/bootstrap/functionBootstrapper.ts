import { isFunction } from "lodash";

const functionBootstrapper = <TValue, UInitializer, VDependency>(
    initializer: UInitializer,
    dependencies: VDependency[]
): TValue => {
    if (!isFunction(initializer)) {
        throw new TypeError(
            "Non-functions cannot be bootstrapped by this bootstrapper."
        );
    }

    return initializer(...dependencies);
};

export { functionBootstrapper };
