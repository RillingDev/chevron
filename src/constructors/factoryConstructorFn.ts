import { dependencyArr } from "../dependency/dependencyArr";

/**
 * Built-in factory constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const factoryConstructorFn = (content: any, dependencies: dependencyArr) =>
    Reflect.construct(content, dependencies);

export { factoryConstructorFn };
