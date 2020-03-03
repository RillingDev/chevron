type InjectableFunctionInitializer<TInstance, VDependency = any> = (
    ...args: VDependency[]
) => TInstance;

export { InjectableFunctionInitializer };
