import { isFunction } from "lodash";

/**
 * Helper method for creating type errors for non-function initializers.
 *
 * @private
 * @return Type error.
 */
const createNonFunctionInitializerError = (): TypeError =>
    new TypeError(
        "Non-functions cannot be bootstrapped by this bootstrapping."
    );

/**
 * {@link Bootstrapping} which constructs the initializer with the dependencies as parameters.
 * Note that this bootstrapping only makes sense for class initializers.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const classBootstrapping = <TValue, UInitializer, VDependency, WContext>(
    initializer: UInitializer,
    dependencies: VDependency[],
    context: WContext
): TValue => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }

    return Reflect.construct(initializer, [...dependencies, context]);
};

/**
 * {@link Bootstrapping} which returns a function executing the initializer with the dependencies as parameters.
 * Note that this bootstrapping only makes sense for function initializers.
 *
 * @public
 * @throws TypeError when used with a non-function initializer.
 */
const functionBootstrapping = <TValue, UInitializer, VDependency, WContext>(
    initializer: UInitializer,
    dependencies: VDependency[],
    context: WContext
): TValue => {
    if (!isFunction(initializer)) {
        throw createNonFunctionInitializerError();
    }

    return initializer(...dependencies, context);
};

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
