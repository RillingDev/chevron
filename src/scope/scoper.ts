import { Entry } from "../Entry";

type scoper<TValue, UInitializer, VDependency, WContext = any> = (
    name: string,
    entry: Entry<TValue, UInitializer, VDependency>,
    context: WContext
) => string | null;

export { scoper };
