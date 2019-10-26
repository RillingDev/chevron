import { TypeBootstrapperFn } from "./TypeBootstrapperFn";

/**
 * Built-in plain bootstrapper.
 *
 * @private
 */
const plainBootstrapper: TypeBootstrapperFn = <T>(initializer: T): T =>
    initializer;

export { plainBootstrapper };
