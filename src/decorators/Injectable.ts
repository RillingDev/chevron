import { Chevron } from "../Chevron";
import { bootstrapper } from "../bootstrap/bootstrapper";
import { identityBootstrapper } from "../bootstrap/identityBootstrapper";

/**
 * Decorator function to be used as TypeScript decorator
 * in order to declare a value to be an injectable which is added to the chevron instance.
 *
 * @param {Chevron} instance Chevron instance to use.
 * @param {string[]} dependencies Array of dependency keys.
 */
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
