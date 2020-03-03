import { InjectableFunctionInitializer } from "./InjectableFunctionInitializer";
import { InjectableClassInitializer } from "./InjectableClassInitializer";
import { Factory } from "./Factory";
/**
 * Pseudo-enum of built-in {@link Factory}s.
 *
 * @public
 */
declare const DefaultFactory: {
    CLASS: <TInstance, UInitializer, VDependency, WContext>() => Factory<TInstance, InjectableClassInitializer<TInstance, VDependency>, VDependency, WContext>;
    FUNCTION: <TInstance_1, UInitializer_1, VDependency_1, WContext_1>() => Factory<TInstance_1, InjectableFunctionInitializer<TInstance_1, VDependency_1>, VDependency_1, WContext_1>;
    IDENTITY: <TInstance_2, UInitializer_2, VDependency_2, WContext_2>() => Factory<TInstance_2, TInstance_2, VDependency_2, WContext_2>;
};
export { DefaultFactory };
//# sourceMappingURL=DefaultFactory.d.ts.map