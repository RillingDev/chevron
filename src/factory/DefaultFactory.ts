import { InjectableFunctionInitializer } from "./InjectableFunctionInitializer";
import { InjectableClassInitializer } from "./InjectableClassInitializer";
import { Factory } from "./Factory";

/**
 * Creates a {@link Factory} which constructs the initializer with the dependencies as parameters.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const classFactoryFactory = <
    TInstance,
    UInitializer,
    VDependency,
    WContext
>(): Factory<
    TInstance,
    InjectableClassInitializer<TInstance, VDependency>,
    VDependency,
    WContext
> => (
    initializer: InjectableClassInitializer<TInstance, VDependency>,
    dependencies: VDependency[]
): TInstance => Reflect.construct(initializer, dependencies);

/**
 * Creates a {@link Factory} which returns a function executing the initializer with the dependencies as parameters.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const functionFactoryFactory = <
    TInstance,
    UInitializer,
    VDependency,
    WContext
>(): Factory<
    TInstance,
    InjectableFunctionInitializer<TInstance, VDependency>,
    VDependency,
    WContext
> => (
    initializer: InjectableFunctionInitializer<TInstance, VDependency>,
    dependencies: VDependency[]
): TInstance => initializer(...dependencies);

/**
 * Creates a {@link Factory} which immediately returns the initializer.
 * This is useful for injectables which do not require any other initialization.
 * Note that by using this factory, no usage of dependencies for this value is possible.
 *
 * @public
 */
const identityFactoryFactory = <
    TInstance,
    UInitializer,
    VDependency,
    WContext
>(): Factory<TInstance, TInstance, VDependency, WContext> => (
    initializer: TInstance
): TInstance => initializer;

/**
 * Pseudo-enum of built-in {@link Factory}s.
 *
 * @public
 */
const DefaultFactory = {
    CLASS: classFactoryFactory,
    FUNCTION: functionFactoryFactory,
    IDENTITY: identityFactoryFactory,
};

export { DefaultFactory };
