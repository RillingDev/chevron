import { typeBootstrapperFn } from "./typeBootstrapperFn";

/**
 * Built-in plain bootstrapper.
 *
 * @private
 */
const plainBootstrapper: typeBootstrapperFn = <T>(content: T): T => content;

export { plainBootstrapper };
