// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { name as getName } from "lightdash";

/**
 * Interface of every nameable value.
 */
interface NameableObject {
    name: string;
}

/**
 * Union type of every nameable value that {@link getName} can use.
 */
type Nameable = NameableObject | string | symbol;

export { Nameable };
