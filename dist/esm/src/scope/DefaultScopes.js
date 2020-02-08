const singletonScopeFactory = () => () => "__SINGLETON__";
/**
 * Creates a {@link Scope} which forces instantiation of a new instance every time the injectable is requested.
 *
 * @public
 */
const prototypeScopeFactory = () => () => null;
/**
 * Pseudo-enum of built-in {@link Scope}s.
 *
 * @public
 */
const DefaultScopes = {
    SINGLETON: singletonScopeFactory,
    PROTOTYPE: prototypeScopeFactory
};
export { DefaultScopes };
//# sourceMappingURL=DefaultScopes.js.map