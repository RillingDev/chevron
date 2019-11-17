type Bootstrapping<TValue, UInitializer, VDependency> = (
    initializer: UInitializer,
    dependencies: VDependency[]
) => TValue;

export { Bootstrapping };
