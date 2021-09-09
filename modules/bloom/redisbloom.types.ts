/**
 * The additional optional parameter of the 'BF.INSERT' command
 * @param capacity The 'CAPACITY' argument. If specified, should be followed by the desired capacity for the filter to be created. This parameter is ignored if the filter already exists. If the filter is automatically created and this parameter is absent, then the default capacity (specified at the module-level) is used.
 * @param error The 'ERROR' argument. If specified, should be followed by the the error ratio of the newly created filter if it does not yet exist. If the filter is automatically created and ERROR is not specified then the default module-level error rate is used.
 * @param expansion The 'EXPANSION' argument. If a new sub-filter is created, its size will be the size of the current filter multiplied by expansion . Default expansion value is 2. This means each subsequent sub-filter will be twice as large as the previous one. 
 * @param nocreate The 'NOCREATE' argument. If specified, indicates that the filter should not be created if it does not already exist. If the filter does not yet exist, an error is returned rather than creating it automatically. This may be used where a strict separation between filter creation and filter addition is desired.
 * @param noscaling The 'NOSCALING' argument. Prevents the filter from creating additional sub-filters if initial capacity is reached. Non-scaling filters requires slightly less memory than their scaling counterparts. 
 */
export type BFInsertParameters = {
    capacity?: number,
    error?: string,
    expansion?: string,
    nocreate?: boolean,
    noscaling?: boolean
}

/**
 * The additional optional parameters of the 'BF.RESERVE' command
 * @param expansion If a new sub-filter is created, its size will be the size of the current filter multiplied by expansion.
 * @param nonscaling Prevents the filter from creating additional sub-filters if initial capacity is reached.
 */
export type BFReserveParameter = {
    expansion?: number,
    nonscaling?: boolean
}

/**
 * The response of the BF commands
 * @param 1 Stands for 'true'
 * @param 0 Stands for 'false'
 */
export type BFResponse = '1' | '0';