import { DependencyKeyArr } from "./DependencyKeyArr";
import { TypeBootstrapperFn } from "./injectableTypes/TypeBootstrapperFn";
interface Entry<TKey> {
    typeBootstrapper: TypeBootstrapperFn;
    dependencies: DependencyKeyArr<TKey>;
    initializer: any;
    content: any;
}
export { Entry };
//# sourceMappingURL=Entry.d.ts.map