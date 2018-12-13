import { dependencyArr } from "../dependency/dependencyArr";
import { bootstrapperFunction } from "../entry/bootstrapperFunction";

type serviceInput<T> = (...args: any[]) => T;
type serviceOutput<T> = () => T;

/**
 * Built-in serviceBootstrapper constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const serviceBootstrapper: bootstrapperFunction = <T>(
    content: serviceInput<T>,
    dependencies: dependencyArr
): serviceOutput<T> =>
    // tslint:disable-next-line:only-arrow-functions
    function() {
        return content(...dependencies, ...arguments);
    };

export { serviceBootstrapper };
