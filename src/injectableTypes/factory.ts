import { dependencyArr } from "../dependency/dependencyArr";
import { bootstrapperFunction } from "../entry/bootstrapperFunction";

type factoryInput<T> = (...args: any[]) => T;
type factoryOutput<T> = T;

/**
 * Built-in factoryBootstrapper constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const factoryBootstrapper: bootstrapperFunction = <T>(
    content: factoryInput<T>,
    dependencies: dependencyArr
): factoryOutput<T> => Reflect.construct(content, dependencies);

export { factoryBootstrapper };
