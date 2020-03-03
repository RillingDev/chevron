/**
 * Creates a {@link Factory} which constructs the initializer with the dependencies as parameters.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const classFactoryFactory = () => (initializer, dependencies) => Reflect.construct(initializer, dependencies);
/**
 * Creates a {@link Factory} which returns a function executing the initializer with the dependencies as parameters.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const functionFactoryFactory = () => (initializer, dependencies) => initializer(...dependencies);
/**
 * Creates a {@link Factory} which immediately returns the initializer.
 * This is useful for injectables which do not require any other initialization.
 * Note that by using this factory, no usage of dependencies for this value is possible.
 *
 * @public
 */
const identityFactoryFactory = () => (initializer) => initializer;
/**
 * Pseudo-enum of built-in {@link Factory}s.
 *
 * @public
 */
const DefaultFactory = {
    CLASS: classFactoryFactory,
    FUNCTION: functionFactoryFactory,
    IDENTITY: identityFactoryFactory
};
export { DefaultFactory };
//# sourceMappingURL=DefaultFactory.js.map