import { Chevron } from "../Chevron";
import { Bootstrapping } from "../bootstrap/Bootstrapping";
import { DefaultBootstrappings } from "../bootstrap/DefaultBootstrappings";
import { Scope } from "../scope/Scope";
import { DefaultScopes } from "../scope/DefaultScopes";

const Injectable = <TValue = any, UInitializer = any, VContext = any>(
    instance: Chevron<TValue, UInitializer>,
    bootstrapping: Bootstrapping<
        any,
        UInitializer,
        any
    > = DefaultBootstrappings.IDENTITY,
    dependencies: string[] = [],
    name: string | null = null,
    scope: Scope<any, UInitializer, any, VContext> = DefaultScopes.SINGLETON
) => (target: any) => {
    instance.registerInjectable(
        target,
        bootstrapping,
        dependencies,
        name,
        scope
    );
    return target;
};

export { Injectable };
