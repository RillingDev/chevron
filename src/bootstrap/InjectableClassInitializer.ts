/**
 * Interface representing a class which can be constructed.
 *
 * @public
 */
interface InjectableClassInitializer<TInstance, VDependency = any> {
    new (...args: VDependency[]): TInstance;
}

export { InjectableClassInitializer };
