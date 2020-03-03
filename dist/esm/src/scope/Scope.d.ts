/**
 * Function interface for a scope function.
 * Scoping takes place when attempting to retrieve an instance, deciding if an existing instance should be reused, and if, which one.
 * Each injectable can have a number of instances which were instantiated by the same initializer using scopes.
 * E.g. for a singleton injectable for which only a single instance should exist at all times, {@link DefaultScope#SINGLETON} is used.
 *
 * The scope function takes user defined context data (e.g. for session handling), the injectable name and its entry,
 * and returns a string identifier (or null, more on that later). for each unique identifier, the same instance will be reused.
 * If null is returned ({@link DefaultScope#PROTOTYPE}), a new instance will be created for every request,
 * and it will not be stored as instance of the injectable for re-use.
 *
 * @public
 */
declare type Scope<TContext> = (context: TContext, injectableEntryName: string) => string | null;
export { Scope };
//# sourceMappingURL=Scope.d.ts.map