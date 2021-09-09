/**
 * The additional optional parameter of the 'CF.INSERT' command
 * @param capacity The 'CAPACITY' argument. If specified, should be followed by the desired capacity for the filter to be created. This parameter is ignored if the filter already exists. If the filter is automatically created and this parameter is absent, then the default capacity (specified at the module-level) is used.
 * @param nocreate The 'NOCREATE' argument. If specified, indicates that the filter should not be created if it does not already exist. If the filter does not yet exist, an error is returned rather than creating it automatically. This may be used where a strict separation between filter creation and filter addition is desired.
 */
export type CFInsertParameters = {
    capacity?: number,
    nocreate?: boolean,
}

/**
 * The response of the CF commands
 * @param 1 Stands for 'true'
 * @param 0 Stands for 'false'
 */
export type CFResponse = '1' | '0';

/**
 * The additional optional parameters of the 'CF.RESERVE' command
 * @param bucketSize Number of items in each bucket. A higher bucket size value improves the fill rate but also causes a higher error rate and slightly slower performance.
 * @param maxIteractions Number of attempts to swap items between buckets before declaring filter as full and creating an additional filter. A low value is better for performance and a higher number is better for filter fill rate.
 * @param expansion When a new filter is created, its size is the size of the current filter multiplied by expansion . Expansion is rounded to the next 2^n number.
 */
export type CFReserveParameters = {
    bucketSize?: number,
    maxIteractions?: number,
    expansion?: number
}