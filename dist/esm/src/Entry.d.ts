import { DependencyKeyArr } from "./DependencyKeyArr";
import { TypeBootstrapperFn } from "./injectableTypes/TypeBootstrapperFn";
interface Entry<TKey, UInit> {
    typeBootstrapper: TypeBootstrapperFn;
    dependencies: DependencyKeyArr<TKey>;
    initializer: UInit;
    content: any;
}
export { Entry };
//# sourceMappingURL=Entry.d.ts.map