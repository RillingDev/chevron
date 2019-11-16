import { isFunction } from "lodash";

const classBootstrapper = <TValue, UInitializer, VDependency>(
    initializer: UInitializer,
    dependencies: VDependency[]
): TValue => {
    if (!isFunction(initializer)) {
        throw new TypeError(
            "Non-functions cannot be bootstrapped by this bootstrapper."
        );
    }

    return Reflect.construct(initializer, dependencies);
};

export { classBootstrapper };
