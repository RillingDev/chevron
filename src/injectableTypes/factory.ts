import { DependencyArr } from "../DependencyArr";
import { TypeBootstrapperFn } from "./TypeBootstrapperFn";

/**
 * Built-in factory bootstrapper.
 *
 * @private
 */
const factoryBootstrapper: TypeBootstrapperFn = <T>(
    initializer: (...args: any[]) => T,
    dependencies: DependencyArr
): T => Reflect.construct(initializer, dependencies);

export { factoryBootstrapper };
