/**
 * Interface representing a function which can be constructed.
 *
 * @public
 */
type InjectableFunctionInitializer<TInstance, VDependency = any> = (
    ...args: VDependency[]
) => TInstance;

export { InjectableFunctionInitializer };
