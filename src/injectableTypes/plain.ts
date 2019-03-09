import { typeBootstrapperFn } from "./typeBootstrapperFn";

/**
 * Built-in plain bootstrapper.
 *
 * @private
 */
const plainBootstrapper: typeBootstrapperFn = <T>(initializer: T): T =>
    initializer;

export { plainBootstrapper };
