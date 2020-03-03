import { InjectableFunctionInitializer } from "./InjectableFunctionInitializer";
import { InjectableClassInitializer } from "./InjectableClassInitializer";
import { Bootstrapping } from "./Bootstrapping";

/**
 * Creates a {@link Bootstrapping} which constructs the initializer with the dependencies as parameters.
 * Note that this bootstrapping only makes sense for class initializers.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const classBootstrappingFactory = <
    TInstance,
    UInitializer,
    VDependency,
    WContext
>(): Bootstrapping<
    TInstance,
    InjectableClassInitializer<TInstance, VDependency>,
    VDependency,
    WContext
> => (
    initializer: InjectableClassInitializer<TInstance, VDependency>,
    dependencies: VDependency[]
): TInstance => Reflect.construct(initializer, dependencies);

/**
 * Creates a {@link Bootstrapping} which returns a function executing the initializer with the dependencies as parameters.
 * Note that this bootstrapping only makes sense for function initializers.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const functionBootstrappingFactory = <
    TInstance,
    UInitializer,
    VDependency,
    WContext
>(): Bootstrapping<
    TInstance,
    InjectableFunctionInitializer<TInstance, VDependency>,
    VDependency,
    WContext
> => (
    initializer: InjectableFunctionInitializer<TInstance, VDependency>,
    dependencies: VDependency[]
): TInstance => initializer(...dependencies);

/**
 * Creates a {@link Bootstrapping} which immediately returns the initializer.
 * This is useful for injectables which do not require any other initialization.
 * Note that by using this bootstrapping, no usage of dependencies for this value is possible.
 *
 * @public
 */
const identityBootstrappingFactory = <
    TInstance,
    UInitializer,
    VDependency,
    WContext
>(): Bootstrapping<TInstance, TInstance, VDependency, WContext> => (
    initializer: TInstance
): TInstance => initializer;

/**
 * Pseudo-enum of built-in {@link Bootstrapping}s.
 *
 * @public
 */
const DefaultBootstrapping = {
    CLASS: classBootstrappingFactory,
    FUNCTION: functionBootstrappingFactory,
    IDENTITY: identityBootstrappingFactory
};

export { DefaultBootstrapping };
