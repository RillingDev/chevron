import { dependencyArr } from "../dependency/dependencyArr";

/**
 * Built-in factory constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const factoryConstructorFn = (content: any, dependencies: dependencyArr) =>
    new (Function.prototype.bind.apply(content, ["", ...dependencies]))();

export { factoryConstructorFn };
