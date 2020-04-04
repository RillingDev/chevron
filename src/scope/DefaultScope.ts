/**
 * Creates a {@link Scope} which forces usage of a single instance for every request.
 *
 * @public
 */
import { Scope } from "./Scope";

const singletonScopeFactory = <TScope>(): Scope<TScope> => (): string =>
    "__SINGLETON__";

/**
 * Creates a {@link Scope} which forces instantiation of a new instance every time the injectable is requested.
 *
 * @public
 */
const prototypeScopeFactory = <TScope>(): Scope<TScope> => (): null => null;

/**
 * Pseudo-enum of built-in {@link Scope}s.
 *
 * @public
 */
const DefaultScope = {
    SINGLETON: singletonScopeFactory,
    PROTOTYPE: prototypeScopeFactory,
};

export { DefaultScope };
