import { dependencyArr } from "../dependencyArr";
import { typeBootstrapperFn } from "./typeBootstrapperFn";

/**
 * Built-in factory bootstrapper.
 *
 * @private
 */
const factoryBootstrapper: typeBootstrapperFn = <T>(
    initializer: (...args: any[]) => T,
    dependencies: dependencyArr
): T => Reflect.construct(initializer, dependencies);

export { factoryBootstrapper };
