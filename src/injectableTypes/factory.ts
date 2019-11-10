import { DependencyArr } from "../DependencyArr";
import { TypeBootstrapperFn } from "./TypeBootstrapperFn";

/**
 * Built-in factory bootstrapper.
 *
 * @private
 */
const factoryBootstrapper: TypeBootstrapperFn = <T, UDependencyValue>(
    initializer: (...args: any[]) => T,
    dependencies: DependencyArr<UDependencyValue>
): T => Reflect.construct(initializer, dependencies);

export { factoryBootstrapper };
