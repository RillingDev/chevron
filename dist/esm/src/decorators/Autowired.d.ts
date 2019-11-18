import { Chevron } from "../Chevron";
/**
 * Retrieves an instantiated injectable, recursively instantiating dependencies if they were not instantiated before,
 * and sets the value on the field/property for this decorator. See {@link Chevron#getInjectableInstance} for details.
 *
 * Decorator function for use with TypeScript. Use this decorator on a object property or class field.
 *
 * @public
 * @param instance {@link Chevron} instance to retrieve the injectable from.
 * @param name Either a raw string name or a nameable value that should be retrieved. See {@link #registerInjectable} for details.
 * @param context Context to be used for instance checks. See {@link Scope} for details.
 * @throws TypeError when no name can be determined for the provided nameable.
 * @throws Error when the injectable or a dependency cannot be found.
 * @throws Error when recursive dependencies are detected.
 */
declare const Autowired: <TValue = any, UInitializer = any, VContext = any>(instance: Chevron<TValue, UInitializer, VContext>, name: string | UInitializer, context?: VContext | null) => (target: any, propertyKey: string | number | symbol) => void;
export { Autowired };
//# sourceMappingURL=Autowired.d.ts.map