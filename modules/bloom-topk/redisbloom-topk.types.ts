/**
 * The response of the TOPK commands
 * @param 1 Stands for 'true'
 * @param 0 Stands for 'false'
 */
export type TOPKResponse = '1' | '0';

 /**
  * The sets of the incrby items (and increments)
  * @param item The item name which counter to be increased.
  * @param increment The counter to be increased by this integer.
  */
export type TOPKIncrbyItems = {
    name: string | number,
    increment: number
}