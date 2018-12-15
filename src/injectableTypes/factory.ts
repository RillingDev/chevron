import { dependencyArr } from "../dependencyArr";
import { typeBootstrapperFn } from "./typeBootstrapperFn";

/**
 * Built-in factoryBootstrapper constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const factoryBootstrapper: typeBootstrapperFn = <T>(
    content: (...args: any[]) => T,
    dependencies: dependencyArr
): T => Reflect.construct(content, dependencies);

export { factoryBootstrapper };
