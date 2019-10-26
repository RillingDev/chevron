import { DependencyArr } from "../DependencyArr";
import { TypeBootstrapperFn } from "./TypeBootstrapperFn";

/**
 * Built-in service bootstrapper.
 *
 * @private
 */
const serviceBootstrapper: TypeBootstrapperFn = <T>(
    initializer: (...args: any[]) => T,
    dependencies: DependencyArr
): (() => T) =>
    function(...args) {
        return initializer(...dependencies, ...args);
    };

export { serviceBootstrapper };
