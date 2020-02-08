import { InjectableFunctionInitializer } from "./InjectableFunctionInitializer";
import { InjectableClassInitializer } from "./InjectableClassInitializer";
import { Bootstrapping } from "./Bootstrapping";
/**
 * Pseudo-enum of built-in {@link Bootstrapping}s.
 *
 * @public
 */
declare const DefaultBootstrappings: {
    CLASS: <TInstance, UInitializer, VDependency, WContext>() => Bootstrapping<TInstance, InjectableClassInitializer<TInstance, VDependency>, VDependency, WContext>;
    FUNCTION: <TInstance_1, UInitializer_1, VDependency_1, WContext_1>() => Bootstrapping<TInstance_1, InjectableFunctionInitializer<TInstance_1, VDependency_1>, VDependency_1, WContext_1>;
    IDENTITY: <TInstance_2, UInitializer_2, VDependency_2, WContext_2>() => Bootstrapping<TInstance_2, TInstance_2, VDependency_2, WContext_2>;
};
export { DefaultBootstrappings };
//# sourceMappingURL=DefaultBootstrappings.d.ts.map