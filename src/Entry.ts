import { bootstrapper } from "./bootstrap/bootstrapper";
import { scoper } from "./scope/scoper";

interface Entry<TValue, UInitializer, VDependency> {
    bootstrapFn: bootstrapper<TValue, UInitializer, VDependency>;
    scopeFn: scoper<TValue, UInitializer, VDependency>;
    dependencies: string[];
    initializer: UInitializer;
    instances: Map<string, TValue>
}

export { Entry };
