import { dependencyArr } from "../chevron";

/**
 * Built-in service constructor.
 *
 * @private
 * @param {*} content
 * @param {Array<*>} dependencies
 */
const serviceConstructorFn = (content: any, dependencies: dependencyArr) =>
    // tslint:disable-next-line:only-arrow-functions
    function() {
        return content(...dependencies, ...arguments);
    };

export { serviceConstructorFn };
