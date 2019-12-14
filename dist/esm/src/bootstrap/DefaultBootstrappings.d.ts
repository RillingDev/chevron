/**
 * Pseudo-enum of built-in {@link Bootstrapping}s.
 *
 * @public
 */
declare const DefaultBootstrappings: {
    CLASS: <TValue, UInitializer, VDependency>(initializer: UInitializer, dependencies: VDependency[]) => TValue;
    FUNCTION: <TValue_1, UInitializer_1, VDependency_1>(initializer: UInitializer_1, dependencies: VDependency_1[]) => any;
    IDENTITY: <TInitializer>(initializer: TInitializer) => TInitializer;
};
export { DefaultBootstrappings };
//# sourceMappingURL=DefaultBootstrappings.d.ts.map