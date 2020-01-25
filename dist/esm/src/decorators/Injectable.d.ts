import { Chevron } from "../Chevron";
import { InjectableOptions } from "../injectable/InjectableOptions";
/**
 * Registers a new injectable on a container. See {@link Chevron#registerInjectable} for details.
 *
 * Decorator function for use with TypeScript. Use this decorator on a variable or function/class expression.
 *
 * Note that, as decorators only work for classes and class related constructs,
 * the bootstrapping defaults to {@link DefaultBootstrappings.CLASS}.
 *
 * @public
 * @param instance {@link Chevron} instance to register the injectable on.
 * @param options Options for this injectable. See {@link Chevron#registerInjectable} for details.
 * @throws Error when an injectable with the requested name is already registered.
 * @throws TypeError when no name can be determined for this injectable or any of its dependencies.
 */
declare const Injectable: <TValue = any, UInitializer = any, VContext = any>(instance: Chevron<TValue, UInitializer, any>, options?: InjectableOptions<TValue, UInitializer, VContext>) => (target: UInitializer) => UInitializer;
export { Injectable };
//# sourceMappingURL=Injectable.d.ts.map