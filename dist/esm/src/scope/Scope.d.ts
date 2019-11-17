import { InjectableEntry } from "../injectable/InjectableEntry";
declare type Scope<TValue, UInitializer, VDependency, WContext> = (context: WContext | null, injectableEntryName: string, injectableEntry: InjectableEntry<TValue, UInitializer, VDependency, WContext>) => string | null;
export { Scope };
//# sourceMappingURL=Scope.d.ts.map