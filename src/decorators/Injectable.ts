import { Chevron } from "../Chevron";
import { bootstrapper } from "../bootstrap/bootstrapper";
import { DefaultBootstrappers } from "../bootstrap/DefaultBootstrappers";

const Injectable = <TValue = any, UInitializer = any>(
    instance: Chevron<TValue, UInitializer>,
    bootstrapFn: bootstrapper<
        any,
        UInitializer,
        any
    > = DefaultBootstrappers.IDENTITY,
    dependencies: string[] = [],
    name: string | null = null
) => (target: any) => {
    instance.register(target, bootstrapFn, dependencies, name);
    return target;
};

export { Injectable };
