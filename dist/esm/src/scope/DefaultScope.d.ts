/**
 * Creates a {@link Scope} which forces usage of a single instance for every request.
 *
 * @public
 */
import { Scope } from "./Scope";
/**
 * Pseudo-enum of built-in {@link Scope}s.
 *
 * @public
 */
declare const DefaultScope: {
    SINGLETON: <TScope>() => Scope<TScope>;
    PROTOTYPE: <TScope_1>() => Scope<TScope_1>;
};
export { DefaultScope };
//# sourceMappingURL=DefaultScope.d.ts.map