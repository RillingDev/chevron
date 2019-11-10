import { DependencyArr } from "../DependencyArr";
import { TypeBootstrapperFn } from "./TypeBootstrapperFn";

/**
 * Built-in factory bootstrapper.
 *
 * @private
 */
const factoryBootstrapper: TypeBootstrapperFn = <TResult, UDependencyValue>(
    initializer: (...args: any[]) => TResult,
    dependencies: DependencyArr<UDependencyValue>
): TResult => Reflect.construct(initializer, dependencies);

export { factoryBootstrapper };
