import { dependencyArr } from "../dependencyArr";
import { bootstrapperFunction } from "./bootstrapperFunction";

/**
 * Built-in serviceBootstrapper constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const serviceBootstrapper: bootstrapperFunction = <T>(
    content: (...args: any[]) => T,
    dependencies: dependencyArr
): (() => T) =>
    // tslint:disable-next-line:only-arrow-functions
    function() {
        return content(...dependencies, ...arguments);
    };

export { serviceBootstrapper };
