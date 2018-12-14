import { dependencyArr } from "../dependencyArr";
import { bootstrapperFunction } from "./bootstrapperFunction";

/**
 * Built-in factoryBootstrapper constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const factoryBootstrapper: bootstrapperFunction = <T>(
    content: (...args: any[]) => T,
    dependencies: dependencyArr
): T => Reflect.construct(content, dependencies);

export { factoryBootstrapper };
