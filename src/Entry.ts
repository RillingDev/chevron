import { bootstrapper } from "./bootstrap/bootstrapper";

interface Entry<TValue, UInitializer, VDependency> {
    bootstrapFn: bootstrapper<TValue, UInitializer, VDependency>;
    dependencies: string[];
    initializer: UInitializer;
    value: TValue | null;
}

export { Entry };
