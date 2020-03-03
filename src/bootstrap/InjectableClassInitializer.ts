interface InjectableClassInitializer<TInstance, VDependency = any> {
    new(...args: VDependency[]): TInstance;
}

export { InjectableClassInitializer };
