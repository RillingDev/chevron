import { Chevron } from "../Chevron";
import { bootstrapper } from "../bootstrap/bootstrapper";
import { Bootstrappers } from "../bootstrap/Bootstrappers";
import { scoper } from "../scope/scoper";
import { Scopes } from "../scope/Scopes";

const Injectable = <TValue = any, UInitializer = any, VContext = any>(
    instance: Chevron<TValue, UInitializer>,
    bootstrapFn: bootstrapper<any, UInitializer, any> = Bootstrappers.IDENTITY,
    dependencies: string[] = [],
    name: string | null = null,
    scopeFn: scoper<any, UInitializer, any, VContext> = Scopes.SINGLETON
) => (target: any) => {
    instance.registerInjectable(
        target,
        bootstrapFn,
        dependencies,
        name,
        scopeFn
    );
    return target;
};

export { Injectable };
