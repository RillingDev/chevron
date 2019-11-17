import { bootstrapper } from "./bootstrap/bootstrapper";
import { scoper } from "./scope/scoper";
interface Entry<TValue, UInitializer, VDependency, WContext> {
    bootstrapFn: bootstrapper<TValue, UInitializer, VDependency>;
    scopeFn: scoper<TValue, UInitializer, VDependency, WContext>;
    dependencies: string[];
    initializer: UInitializer;
    instances: Map<string, TValue>;
}
export { Entry };
//# sourceMappingURL=Entry.d.ts.map