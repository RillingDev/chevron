import { Chevron } from "../Chevron";
import { InjectableOptions } from "../injectable/InjectableOptions";
/**
 * Registers a new injectable on a container. See {@link Chevron#registerInjectable} for details.
 *
 * Decorator function for use with TypeScript. Use this decorator on a variable or function/class expression.
 *
 * Note that, as decorators only work for classes and class related constructs,
 * the factory defaults to {@link DefaultFactory.CLASS}.
 *
 * @public
 * @param instance {@link Chevron} instance to register the injectable on.
 * @param options Options for this injectable. See {@link Chevron#registerInjectable} for details.
 * @typeparam TInstance type a constructed instance will have.
 * @typeparam UDependency should not be set explicitly usually. Type of the dependencies used by this injectable.
 * @typeparam VContext should not be set explicitly usually. Type of the context used for scoping.
 * @throws Error when an injectable with the requested name is already registered.
 * @throws TypeError when no name can be determined for this injectable or any of its dependencies.
 */
declare const Injectable: <TInstance, UDependency = any, VContext = any>(instance: Chevron<VContext | null>, options?: InjectableOptions<TInstance, any, UDependency, VContext | null>) => ClassDecorator;
export { Injectable };
//# sourceMappingURL=Injectable.d.ts.map