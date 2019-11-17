import { Entry } from "../Entry";
declare type scoper<TValue, UInitializer, VDependency, WContext> = (name: string, entry: Entry<TValue, UInitializer, VDependency, WContext>, context: WContext | null) => string | null;
export { scoper };
//# sourceMappingURL=scoper.d.ts.map