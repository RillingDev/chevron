/**
 * Creates a {@link Scope} which forces usage of a single instance for every request.
 *
 * @public
 */
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
const DefaultScope = {
    SINGLETON: singletonScopeFactory,
    PROTOTYPE: prototypeScopeFactory,
};
export { DefaultScope };
//# sourceMappingURL=DefaultScope.js.map