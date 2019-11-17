import { Chevron } from "../Chevron";
import { InjectableOptions } from "../injectable/InjectableOptions";

const Injectable = <TValue = any, UInitializer = any, VContext = any>(
    instance: Chevron<TValue, UInitializer>,
    dependencies: any[],
    options: InjectableOptions<TValue, UInitializer, VContext> = {}
) => (target: any) => {
    instance.registerInjectable(target, dependencies, options);
    return target;
};

export { Injectable };
