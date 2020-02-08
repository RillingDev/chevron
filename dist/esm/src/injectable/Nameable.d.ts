/**
 * Interface of every nameable value.
 *
 * @private
 */
interface NameableObject {
    name: string;
}
/**
 * Union type of every nameable value that {@link getName} can use.
 *
 * @private
 */
declare type Nameable = NameableObject | string | symbol;
export { Nameable };
//# sourceMappingURL=Nameable.d.ts.map