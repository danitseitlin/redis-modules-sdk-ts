/**
 * The info JS object
 * @param totalSamples The count of total samples
 * @param memoryUsage The memory usage
 * @param firstTimestamp The first timestamp
 * @param lastTimestamp The last timestamp
 * @param retentionTime The retention time
 * @param chunkCount The cound of chunks
 * @param chunkSize The chunk size
 * @param duplicatePolicy If duplicate policy is set
 * @param labels A list of labels
 * @param sourceKey If source key is set
 * @param rules A list of rules
 */
export type TSInfo = {
    totalSamples?: string,
    memoryUsage?: number,
    firstTimestamp?: number,
    lastTimestamp?: number,
    retentionTime?: number,
    chunkCount?: number,
    chunkSize?: number,
    duplicatePolicy?: string | null,
    labels?: Array<string[]>,
    sourceKey?: string | null,
    rules?: Array<string[]>,
}

/**
 * The 'TS.CREATE' optional parameter
 * @param retention The 'RETENTION' optional parameter
 * @param uncompressed The 'UNCOMPRESSED' optional parameter
 * @param chunkSize The 'CHUNK_SIZE' optional parameter
 * @param labels A list of 'LABELS' optional parameter
 * @param duplicatePolicy The 'DUPLICATE_POLICY' optional parameter
 */
export interface TSCreateOptions extends TSOptions {
    duplicatePolicy?: string
}
/**
 * The label object
 * @param name The name of the label
 * @param value The value of the label
 */
export type TSLabel = {
    name: string,
    value: string
}

/**
 * The 'TS.ADD' command optional parameters
 * @param onDuplicate The 'ON_DUPLICATE' optional parameter
 * @param retention The 'RETENTION' optional parameter
 * @param uncompressed The 'UNCOMPRESSED' optional parameter
 * @param chunkSize The 'CHUNK_SIZE' optional parameter
 * @param labels A list of 'LABELS' optional parameter
 */
export interface TSAddOptions extends TSOptions {
    onDuplicate?: TSDuplicatePolicyType 
}

/** 
* The 'TS.ALTER' command optional parameters
* @param retention The 'RETENTION' optional parameter
* @param chunkSize The 'CHUNK_SIZE' optional parameter
* @param duplicatePolicy The DUPLICATE_POLICY optional parameter
* @param labels A list of 'LABELS' optional parameter
*/
export type TSAlterOptions = {
    retention?: number, 
    chunkSize?: number,
    duplicatePolicy?: TSDuplicatePolicyType, 
    labels?: TSLabel[]
}

/**
 * The available Duplicate policy types. Policy that will define handling of duplicate samples.
 * @param BLOCK an error will occur for any out of order sample
 * @param FIRST ignore the new value
 * @param LAST override with latest value
 * @param MIN only override if the value is lower than the existing value
 * @param MAX only override if the value is higher than the existing value
 * @param SUM If a previous sample exists, add the new sample to it so that the updated value is equal to (previous + new). If no previous sample exists, set the updated value equal to the new value.
 */
export type TSDuplicatePolicyType = 'BLOCK' | 'FIRST' | 'LAST' | 'MIN' | 'MAX' | 'SUM';

/**
 * The 'TS.KEYSET' command optional parameters
 * @param key The key
 * @param timestamp The timestamp
 * @param value The value
 */
export type TSKeySet = {
    key: string,
    timestamp: string,
    value: string
}

/**
 * The 'TS.INCRBY/TS.DECRBY' command optional parameters
 * @param timestamp The 'TIMESTAMP' optional parameter
 * @param retention The 'RETENTION' optional parameter
 * @param uncompressed The 'UNCOMPRESSED' optional parameter
 * @param chunkSize The 'CHUNK_SIZE' optional parameter
 * @param labels A list of 'LABELS' optional parameter
 */
export interface TSIncrbyDecrbyOptions extends TSOptions {
    timestamp?: number
}

/**
 * The TS optional parameters
 * @param retention The 'RETENTION' optional parameter
 * @param uncompressed The 'UNCOMPRESSED' optional parameter
 * @param chunkSize The 'CHUNK_SIZE' optional parameter
 * @param labels A list of 'LABELS' optional parameter
 */


export type TSOptions = {
    retention?: number,
    uncompressed?: boolean,
    chunkSize?: number,
    labels?: TSLabel[]
}

/**
 * The 'TS.CREATERULE' command optional parameters
 * @param sourceKey The source key
 * @param destKey The dest key
 * @param aggregation The aggregation type
 * @param timeBucket The time bucket
 */
export type TSCreateRule = {
    sourceKey: string,
    destKey: string,
    aggregation: TSAggregationType,
    timeBucket: number
}

/**
 * The available types of aggregation
 */
export type TSAggregationType = 'avg' | 'sum' | 'min' | 'max' | 'range' | 'range' | 'count' | 'first' | 'last' | 'std.p' | 'std.s' | 'var.p' | 'var.s';

/**
 * The 'TS.Range' command optional parameters
 * @param align The 'ALIGN' optional parameter
 * @param count The 'COUNT' optional parameter
 * @param filterByValue The 'FILTER_BY_VALUE' optional parameter. 
 * @param filterByValue.min The min value to filter by
 * @param filterByValue.max The max value to filter by`
 * @param filterByTS The 'FILTER_BY_TS' optional parameter. A list of TS values.  
 * @param aggregation The 'AGGREGATION' optional parameter
 * @param aggregation.type The type of the 'AGGREGATION' command
 * @param aggregation.timeBucket The time bucket of the 'AGGREGATION' command
 */
export type TSRangeOptions = {
    count?: number,
    align?: TSAlignType,
    filterByValue?: {
        min: number,
        max: number
    },
    filterByTS?: string[],
    aggregation?: {
        type: TSAggregationType,
        timeBucket: number
    }
}

/**
 * The 'TS.MRange' command optional parameters
 * @param count The 'COUNT' optional parameter
 * @param aggregation The 'AGGREGATION' optional parameter
 * @param aggregation.type The type of the 'AGGREGATION' command
 * @param aggregation.timeBucket The time bucket of the 'AGGREGATION' command
 * @param withLabels The 'WITHLABELS' optional parameter
 * @param groupBy The 'GROUPBY' optional parameters
 * @param groupBy.label The label of the 'GROUPBY' parameters
 * @param groupBy.reducer The reducer of the 'GROUPBY' parameters
 */
export interface TSMRangeOptions extends TSRangeOptions {
    withLabels?: boolean,
    groupBy?: {
        label: string,
        reducer: 'SUM' | 'MIN' | 'MAX'
    }
}

/**
 * The available values of Align aggregation
 * @param start The reference timestamp will be the query start interval time (fromTimestamp).
 * @param + The reference timestamp will be the query start interval time (fromTimestamp).
 * @param end The reference timestamp will be the signed remainder of query end interval time by the AGGREGATION time bucket (toTimestamp % timeBucket).
 * @param - The reference timestamp will be the signed remainder of query end interval time by the AGGREGATION time bucket (toTimestamp % timeBucket).
 */
export type TSAlignType = 'start' | '+' | 'end' | '-';