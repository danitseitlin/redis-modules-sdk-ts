/**
 * The sets of the incrby items (and increments)
 * @param name The item name which counter to be increased.
 * @param increment The counter to be increased by this integer.
 */
export type CMKIncrbyItems = {
    name: string,
    increment: number
}