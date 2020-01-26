import { InjectableFunctionInitializer } from "./InjectableFunctionInitializer";
import { InjectableClassInitializer } from "./InjectableClassInitializer";

/**
 * {@link Bootstrapping} which constructs the initializer with the dependencies as parameters.
 * Note that this bootstrapping only makes sense for class initializers.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const classBootstrapping = <TInstance, VDependency>(
    initializer: InjectableClassInitializer<TInstance, VDependency>,
    dependencies: VDependency[]
): TInstance => Reflect.construct(initializer, dependencies);

/**
 * {@link Bootstrapping} which returns a function executing the initializer with the dependencies as parameters.
 * Note that this bootstrapping only makes sense for function initializers.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const functionBootstrapping = <TInstance, VDependency>(
    initializer: InjectableFunctionInitializer<TInstance, VDependency>,
    dependencies: VDependency[]
): TInstance => initializer(...dependencies);

/**
 * {@link Bootstrapping} which immediately returns the initializer.
 * This is useful for injectables which do not require any other initialization.
 * Note that by using this bootstrapping, no usage of dependencies for this value is possible.
 *
 * @public
 */
const identityBootstrapping = <TInitializer>(
    initializer: TInitializer
): TInitializer => initializer;

/**
 * Pseudo-enum of built-in {@link Bootstrapping}s.
 *
 * @public
 */
const DefaultBootstrappings = {
    CLASS: classBootstrapping,
    FUNCTION: functionBootstrapping,
    IDENTITY: identityBootstrapping
};

export { DefaultBootstrappings };
