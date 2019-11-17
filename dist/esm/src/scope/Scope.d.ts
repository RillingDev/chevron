import { InjectableEntry } from "../InjectableEntry";
declare type Scope<TValue, UInitializer, VDependency, WContext> = (name: string, injectableEntry: InjectableEntry<TValue, UInitializer, VDependency, WContext>, context: WContext | null) => string | null;
export { Scope };
//# sourceMappingURL=Scope.d.ts.map