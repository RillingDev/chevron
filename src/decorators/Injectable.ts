import { Chevron } from "../Chevron";
import { bootstrapper } from "../bootstrap/bootstrapper";
import { identityBootstrapper } from "../bootstrap/identityBootstrapper";

const Injectable = <TValue = any, UInitializer = any>(
    instance: Chevron<TValue, UInitializer>,
    bootstrapFn: bootstrapper<any, UInitializer, any> = identityBootstrapper,
    dependencies: string[] = [],
    name: string | null = null
) => (target: any) => {
    instance.register(target, bootstrapFn, dependencies, name);
    return target;
};

export { Injectable };
