type bootstrapper<TValue, UInitializer, VDependency> = (
    initializer: UInitializer,
    dependencies: VDependency[]
) => TValue;

export { bootstrapper };
