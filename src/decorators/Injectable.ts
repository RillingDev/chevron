import { Chevron } from "../Chevron";
import { InjectableOptions } from "../injectable/InjectableOptions";

/**
 * Registers a new injectable on a container. See {@link Chevron#registerInjectable} for details.
 *
 * Decorator function for use with TypeScript. Use this decorator on a variable or function/class expression.
 *
 * @public
 * @param instance {@link Chevron} instance to register the injectable on.
 * @param dependencies Definitions of this injectables dependencies. See {@link Chevron#registerInjectable} for details.
 * @param options Options for this injectable. See {@link Chevron#registerInjectable} for details.
 * @throws Error when an injectable with the requested name is already registered.
 * @throws TypeError when no name can be determined for this injectable or any of its dependencies.
 */
const Injectable = <TValue = any, UInitializer = any, VContext = any>(
    instance: Chevron<TValue, UInitializer>,
    dependencies: any[],
    options: InjectableOptions<TValue, UInitializer, VContext> = {}
) => (target: any) => {
    instance.registerInjectable(target, dependencies, options);
    return target;
};

export { Injectable };
