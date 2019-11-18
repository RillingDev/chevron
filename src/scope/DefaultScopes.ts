// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Scope } from "./Scope";

/**
 * {@link Scope} which forces usage of a single instance for every request.
 *
 * @public
 */
const singletonScope = (context: any, injectableEntryName: string): string =>
    `SINGLETON_${injectableEntryName}`;

/**
 * {@link Scope} which forces instantiation of a new instance every time the injectable is requested.
 *
 * @public
 */
const prototypeScope = (): null => null;

/**
 * Pseudo-enum of built-in {@link Scope}s.
 *
 * @public
 */
const DefaultScopes = {
    SINGLETON: singletonScope,
    PROTOTYPE: prototypeScope
};

export { DefaultScopes };
