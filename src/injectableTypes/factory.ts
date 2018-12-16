import { dependencyArr } from "../dependencyArr";
import { typeBootstrapperFn } from "./typeBootstrapperFn";

/**
 * Built-in factory bootstrapper.
 *
 * @private
 */
const factoryBootstrapper: typeBootstrapperFn = <T>(
    content: (...args: any[]) => T,
    dependencies: dependencyArr
): T => Reflect.construct(content, dependencies);

export { factoryBootstrapper };
