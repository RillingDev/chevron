/**
 * Pseudo-enum of built-in {@link Bootstrapping}s.
 *
 * @public
 */
declare const DefaultBootstrappings: {
    CLASS: <TValue, UInitializer, VDependency, WContext>(initializer: UInitializer, dependencies: VDependency[], context: WContext) => TValue;
    FUNCTION: <TValue_1, UInitializer_1, VDependency_1, WContext_1>(initializer: UInitializer_1, dependencies: VDependency_1[], context: WContext_1) => TValue_1;
    IDENTITY: <TInitializer>(initializer: TInitializer) => TInitializer;
};
export { DefaultBootstrappings };
//# sourceMappingURL=DefaultBootstrappings.d.ts.map