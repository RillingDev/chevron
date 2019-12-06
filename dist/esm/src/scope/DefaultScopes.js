/**
 * {@link Scope} which forces usage of a single instance for every request.
 *
 * @public
 */
const singletonScope = () => "__SINGLETON__";
/**
 * {@link Scope} which forces instantiation of a new instance every time the injectable is requested.
 *
 * @public
 */
const prototypeScope = () => null;
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
//# sourceMappingURL=DefaultScopes.js.map