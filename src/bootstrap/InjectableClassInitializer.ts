interface InjectableClassInitializer<TInstance, VDependency> {
    new (...args: VDependency[]): TInstance;
}

export { InjectableClassInitializer };
