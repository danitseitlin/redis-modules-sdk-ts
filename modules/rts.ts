import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';
import { Commander } from './rts.commander';

export class RedisTimeSeries extends Module {

    commander: Commander
    /**
     * Initializing the module object
     * @param name The name of the module
     * @param clusterNodes The nodes of the cluster
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     * @param clusterOptions The options of the clusters
     */
    constructor(clusterNodes: Redis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: Redis.ClusterOptions)
    /**
     * Initializing the module object
     * @param name The name of the module
     * @param redisOptions The options of the redis database
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     */
    constructor(redisOptions: Redis.RedisOptions, moduleOptions?: RedisModuleOptions)
    constructor(options: Redis.RedisOptions & Redis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: Redis.ClusterOptions) {
        super(RedisTimeSeries.name, options, moduleOptions, clusterOptions)
        this.commander = new Commander()
    }

    /**
     * Creating a new TS key
     * @param key The key
     * @param options The 'TS.CREATE' optional parameter
     * @param options.retention The 'RETENTION' optional parameter
     * @param options.uncompressed The 'UNCOMPRESSED' optional parameter
     * @param options.chunkSize The 'CHUNK_SIZE' optional parameter
     * @param options.labels A list of 'LABELS' optional parameter
     * @param options.duplicatePolicy The 'DUPLICATE_POLICY' optional parameter
     * @returns "OK"
     */
    async create(key: string, options?: TSCreateOptions): Promise<'OK'> {
        const command = this.commander.create(key, options);
        return await this.sendCommand(command);
    }

    /**
     * Altering an existing TS key
     * @param key Required. The key
     * @param retention Optional. The retention time
     * @param labels Optional. The labels to update
     * 
     */
    async alter(key: string, retention?: number, labels?: TSLabel[]): Promise<'OK'> {
        const command = this.commander.alter(key, retention, labels);
        return await this.sendCommand(command);
    }

    /**
     * Appending/creating a new sample to series
     * @param key The key
     * @param timestamp The timestamp
     * @param value The value
     * @param options The 'TS.ADD' command optional parameters
     * @param options.onDuplicate The 'ON_DUPLICATE' optional parameter
     * @param options.retention The 'RETENTION' optional parameter
     * @param options.uncompressed The 'UNCOMPRESSED' optional parameter
     * @param options.chunkSize The 'CHUNK_SIZE' optional parameter
     * @param options.labels A list of 'LABELS' optional parameter
     */
    async add(key: string, timestamp: string, value: string, options?: TSAddOptions): Promise<number> {
        const command = this.commander.add(key, timestamp, value, options);
        return await this.sendCommand(command);
    }

    /**
     * Appending new samples to a list of series
     * @param keySets A list of key sets
     * @param keySets.key The key
     * @param keySets.timestamp The timestamp
     * @param keySets.value The value
     */
    async madd(keySets: TSKeySet[]):Promise<number[]> {
        const command = this.commander.madd(keySets);
        return await this.sendCommand(command);
    }

    /**
     * Creating a new sample that increments the latest sample's value
     * @param key The key
     * @param value The value
     * @param options The 'TS.INCRBY' command optional parameters
     * @param options.timestamp The 'TIMESTAMP' optional parameter
     * @param options.retention The 'RETENTION' optional parameter
     * @param options.uncompressed The 'UNCOMPRESSED' optional parameter
     * @param options.chunkSize The 'CHUNK_SIZE' optional parameter
     * @param options.labels A list of 'LABELS' optional parameter
     */
    async incrby(key: string, value: string, options?: TSIncrbyDecrbyOptions): Promise<number> {
        const command = this.commander.incrby(key, value, options);
        return await this.sendCommand(command);
    }

    /**
     * Creating a new sample that decrements the latest sample's value
     * @param key The key
     * @param value The value
     * @param options The 'TS.DECRBY' command optional parameters
     * @param options.timestamp The 'TIMESTAMP' optional parameter
     * @param options.retention The 'RETENTION' optional parameter
     * @param options.uncompressed The 'UNCOMPRESSED' optional parameter
     * @param options.chunkSize The 'CHUNK_SIZE' optional parameter
     * @param options.labels A list of 'LABELS' optional parameter
     */
    async decrby(key: string, value: string, options?: TSIncrbyDecrbyOptions): Promise<number> {
        const command = this.commander.decrby(key, value, options);
        return await this.sendCommand(command);
    }
    
    /**
     * Creating a compaction rule
     * @param parameters The 'TS.CREATERULE' command optional parameters
     * @param options.sourceKey The source key
     * @param options.destKey The dest key
     * @param options.aggregation The aggregation type
     * @param options.timeBucket The time bucket
     */
    async createrule(parameters: TSCreateRule): Promise<'OK'> {
        const command = this.commander.createrule(parameters);
        return await this.sendCommand(command);
    }

    /**
     * Deleting a compaction rule
     * @param sourceKey The source key
     * @param destKey The dest key
     */
    async deleterule(sourceKey: string, destKey: string): Promise<'OK'> {
        const command = this.commander.deleterule(sourceKey, destKey);
        return await this.sendCommand(command);
    }

    /**
     * Querying a range in forward directions
     * @param key The key
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param options The 'TS.Range' command optional parameters
     * @param options.count The 'COUNT' optional parameter
     * @param options.aggregation The 'AGGREGATION' optional parameter
     * @param options.aggregation.type The type of the 'AGGREGATION' command
     * @param options.aggregation.timeBucket The time bucket of the 'AGGREGATION' command
     */
    async range(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions): Promise<number[]> {
        const command = this.commander.range(key, fromTimestamp, toTimestamp, options);
        return await this.sendCommand(command);
    }
    
    /**
     * Querying a range in reverse directions
     * @param key The key
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param options The 'TS.Range' command optional parameters
     * @param options.count The 'COUNT' optional parameter
     * @param options.aggregation The 'AGGREGATION' optional parameter
     * @param options.aggregation.type The type of the 'AGGREGATION' command
     * @param options.aggregation.timeBucket The time bucket of the 'AGGREGATION' command
     */
    async revrange(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions): Promise<number[]> {
        const command = this.commander.revrange(key, fromTimestamp, toTimestamp, options);
        return await this.sendCommand(command);
    }

    /**
     * Querying a range across multiple time-series by filters in forward directions
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param filter The filter
     * @param options The 'TS.MRange' command optional parameters
     * @param options.count The 'COUNT' optional parameter
     * @param options.aggregation The 'AGGREGATION' optional parameter
     * @param options.aggregation.type The type of the 'AGGREGATION' command
     * @param options.aggregation.timeBucket The time bucket of the 'AGGREGATION' command
     * @param options.withLabels The 'WITHLABELS' optional parameter
     */
    async mrange(fromTimestamp: string, toTimestamp: string, filter: string, options?: TSMRangeOptions): Promise<(string | number)[][]> {
        const command = this.commander.mrange(fromTimestamp, toTimestamp, filter, options);
        return await this.sendCommand(command);
    }
    
    /**
     * Querying a range across multiple time-series by filters in reverse directions
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param filter The filter
     * @param options The 'TS.MRange' command optional parameters
     * @param options.count The 'COUNT' optional parameter
     * @param options.aggregation The 'AGGREGATION' optional parameter
     * @param options.aggregation.type The type of the 'AGGREGATION' command
     * @param options.aggregation.timeBucket The time bucket of the 'AGGREGATION' command
     * @param options.withLabels The 'WITHLABELS' optional parameter
     */
    async mrevrange(fromTimestamp: string, toTimestamp: string, filter: string, options?: TSMRangeOptions): Promise<(string | number)[][]> {
        const command = this.commander.mrevrange(fromTimestamp, toTimestamp, filter, options);
        return await this.sendCommand(command);
    }
    
    /**
     * Retrieving the last sample of a key
     * @param key The key
     */
    async get(key: string): Promise<(string | number)[]> {
        const command = this.commander.get(key);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving the last sample of a key by filter
     * @param filter Required. The filter
     * @param withLabels Optional. If to add the 'WITHLABELS' Optional parameter
     */
    async mget(filter: string, withLabels?: boolean): Promise<(string | number)[][]> {
        const command = this.commander.mget(filter, withLabels);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving information and statistics on the time-series
     * @param key The key
     */
    async info(key: string): Promise<TSInfo> {
        const command = this.commander.info(key);
        const response = await this.sendCommand(command);
        const info: TSInfo = {};
        for(let i = 0; i < response.length; i+=2) {
            info[response[i]] = response[i+1];
        }
        return info;
    }

    /**
     * Retrieving all the keys matching the filter list
     * @param filter The filter
     */
    async queryindex(filter: string): Promise<string[]> {
        const command = this.commander.queryindex(filter);
        return await this.sendCommand(command);
    }

    /**
     * Delete data points for a given timeseries and interval range in the form of start and end delete timestamps.
     * @param key Key name for timeseries
     * @param fromTimestamp Start timestamp for the range deletion.
     * @param toTimestamp End timestamp for the range deletion.
     * @returns The count of samples deleted
     */
    async del(key: string, fromTimestamp: string, toTimestamp: string): Promise<number> {
        const command = this.commander.del(key, fromTimestamp, toTimestamp);
        return await this.sendCommand(command);
    }
}

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
    duplicatePolicy?: boolean | null,
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
    onDuplicate?: boolean
}

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