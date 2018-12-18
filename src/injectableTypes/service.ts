import { dependencyArr } from "../dependencyArr";
import { typeBootstrapperFn } from "./typeBootstrapperFn";

/**
 * Built-in service bootstrapper.
 *
 * @private
 */
const serviceBootstrapper: typeBootstrapperFn = <T>(
    initializer: (...args: any[]) => T,
    dependencies: dependencyArr
): (() => T) =>
    // tslint:disable-next-line:only-arrow-functions
    function() {
        return initializer(...dependencies, ...arguments);
    };

export { serviceBootstrapper };
