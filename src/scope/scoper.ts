import { Entry } from "../Entry";

type scoper<TValue, UInitializer, VDependency, WContext> = (
    name: string,
    entry: Entry<TValue, UInitializer, VDependency, WContext>,
    context: WContext | null
) => string | null;

export { scoper };
