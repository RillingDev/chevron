type InjectableFunctionInitializer<TInstance, VDependency> = (
    ...args: VDependency[]
) => TInstance;

export { InjectableFunctionInitializer };
