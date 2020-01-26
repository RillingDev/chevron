import { InjectableFunctionInitializer } from "./InjectableFunctionInitializer";
import { InjectableClassInitializer } from "./InjectableClassInitializer";
/**
 * Pseudo-enum of built-in {@link Bootstrapping}s.
 *
 * @public
 */
declare const DefaultBootstrappings: {
    CLASS: <TInstance, VDependency>(initializer: InjectableClassInitializer<TInstance, VDependency>, dependencies: VDependency[]) => TInstance;
    FUNCTION: <TInstance_1, VDependency_1>(initializer: InjectableFunctionInitializer<TInstance_1, VDependency_1>, dependencies: VDependency_1[]) => TInstance_1;
    IDENTITY: <TInitializer>(initializer: TInitializer) => TInitializer;
};
export { DefaultBootstrappings };
//# sourceMappingURL=DefaultBootstrappings.d.ts.map