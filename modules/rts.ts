
import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisTimeSeries extends Module {

    /**
     * Initializing the RTS object.
     * @param options The options of the Redis database.
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     */
    constructor(options: Redis.RedisOptions, public moduleOptions?: RedisModuleOptions) {
        super(RedisTimeSeries.name, options, moduleOptions)
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
        try {
            let args = [key];
            if(options !== undefined && options.retention !== undefined)
                args = args.concat(['RETENTION', options.retention.toString()]);
            if(options !== undefined && options.uncompressed === true)
                args.push('UNCOMPRESSED')
            if(options !== undefined && options.chunkSize !== undefined)
                args = args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
            if(options !== undefined && options.duplicatePolicy !== undefined)
                args = args.concat(['DUPLICATE_POLICY', options.duplicatePolicy])
            if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
                args.push('LABELS');
                for(const label of options.labels) {
                    args = args.concat([label.name, label.value])
                }
            }
            return await this.sendCommand('TS.CREATE', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Altering an existing TS key
     * @param key Required. The key
     * @param retention Optional. The retention time
     * @param labels Optional. The labels to update
     * 
     */
    async alter(key: string, retention?: number, labels?: TSLabel[]): Promise<'OK'> {
        try {
            let args = [key];
            if(retention !== undefined)
                args = args.concat(['RETENTION', retention.toString()]);
            if(labels !== undefined && labels.length > 0) {
                args.push('LABELS')
                for(const label of labels) {
                    args = args.concat([label.name, label.value]);
                }
            }
            return await this.sendCommand('TS.ALTER', args)
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            let args = [key, timestamp, value];
            if(options !== undefined && options.retention !== undefined)
                args = args.concat(['RETENTION', options.retention.toString()])
            if(options !== undefined && options.uncompressed === true)
                args.push('UNCOMPRESSED');
            if(options !== undefined && options.onDuplicate === true)
                args.push('ON_DUPLICATE');
            if(options !== undefined && options.chunkSize !== undefined)
                args = args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
            if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
                args.push('LABELS')
                for(const label of options.labels) {
                    args = args.concat([label.name, label.value]);
                }
            }
            return await this.sendCommand('TS.ADD', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Appending new samples to a list of series
     * @param keySets A list of key sets
     * @param keySets.key The key
     * @param keySets.timestamp The timestamp
     * @param keySets.value The value
     */
    async madd(keySets: TSKeySet[]):Promise<number[]> {
        try {
            let args: string[] = []
            for(const keySet of keySets)
                args = args.concat([keySet.key, keySet.timestamp, keySet.value]);
            return await this.sendCommand('TS.MADD', args);   
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            let args = [key, value];
            if(options !== undefined && options.retention !== undefined)
                args = args.concat(['RETENTION', options.retention.toString()])
            if(options !== undefined && options.uncompressed === true)
                args.push('UNCOMPRESSED');
            if(options !== undefined && options.chunkSize !== undefined)
                args = args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
            if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
                args.push('LABELS')
                for(const label of options.labels) {
                    args = args.concat([label.name, label.value]);
                }
            }
            return await this.sendCommand('TS.INCRBY', args);
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            let args = [key, value];
            if(options !== undefined && options.retention !== undefined)
                args = args.concat(['RETENTION', options.retention.toString()])
            if(options !== undefined && options.uncompressed === true)
                args.push('UNCOMPRESSED');
            if(options !== undefined && options.chunkSize !== undefined)
                args = args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
            if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
                args.push('LABELS')
                for(const label of options.labels) {
                    args = args.concat([label.name, label.value]);
                }
            }
            return await this.sendCommand('TS.DECRBY', args);
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            const args = [parameters.sourceKey, parameters.destKey, 'AGGREGATION', parameters.aggregation, parameters.timeBucket.toString()]
            return await this.sendCommand('TS.CREATERULE', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Deleting a compaction rule
     * @param sourceKey The source key
     * @param destKey The dest key
     */
    async deleterule(sourceKey: string, destKey: string): Promise<'OK'> {
        try {
            return await this.sendCommand('TS.DELETERULE', sourceKey, destKey)
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            let args = [key, fromTimestamp, toTimestamp];
            if(options !== undefined && options.count !== undefined)
                args = args.concat(['COUNT', options.count.toString()]);
            if(options !== undefined && options.aggregation !== undefined)
                args = args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
            return await this.sendCommand('TS.RANGE', args)
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            let args = [key, fromTimestamp.toString(), toTimestamp.toString()];
            if(options !== undefined && options.count !== undefined)
                args = args.concat(['COUNT', options.count.toString()]);
            if(options !== undefined && options.aggregation !== undefined)
                args = args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
            return await this.sendCommand('TS.REVRANGE', args)
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            let args = [fromTimestamp, toTimestamp];
            if(options !== undefined && options.count !== undefined)
                args = args.concat(['COUNT', options.count.toString()]);
            if(options !== undefined && options.aggregation !== undefined)
                args = args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
            if(options !== undefined && options.withLabels !== undefined)
                args.push('WITHLABELS')
            if(options !== undefined && options.groupBy)
                args = args.concat(['GROUPBY', options.groupBy.label, 'REDUCE', options.groupBy.reducer])
            args = args.concat(['FILTER', filter])
            return await this.sendCommand('TS.MRANGE', args)
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            let args = [fromTimestamp, toTimestamp];
            if(options !== undefined && options.count !== undefined)
                args = args.concat(['COUNT', options.count.toString()]);
            if(options !== undefined && options.aggregation !== undefined)
                args = args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
            if(options !== undefined && options.withLabels !== undefined)
                args.push('WITHLABELS')
            if(options !== undefined && options.groupBy)
                args = args.concat(['GROUPBY', options.groupBy.label, 'REDUCE', options.groupBy.reducer])
            args = args.concat(['FILTER', filter])
            return await this.sendCommand('TS.MREVRANGE', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving the last sample of a key
     * @param key The key
     */
    async get(key: string): Promise<(string | number)[]> {
        try {
            return await this.sendCommand('TS.GET', key);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving the last sample of a key by filter
     * @param filter Required. The filter
     * @param withLabels Optional. If to add the 'WITHLABELS' Optional parameter
     */
    async mget(filter: string, withLabels?: boolean): Promise<(string | number)[][]> {
        try {
            let args: string[] = [];
            if(withLabels === true)
                args.push('WITHLABELS');
            args = args.concat(['FILTER', filter])
            return await this.sendCommand('TS.MGET', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving information and statistics on the time-series
     * @param key The key
     */
    async info(key: string): Promise<TSInfo> {
        try {
            const response = await this.sendCommand('TS.INFO', key);
            const info: TSInfo = {};
            for(let i = 0; i < response.length; i+=2) {
                info[response[i]] = response[i+1];
            }
            return info;
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving all the keys matching the filter list
     * @param filter The filter
     */
    async queryindex(filter: string): Promise<string[]> {
        try {
            return await this.sendCommand('TS.QUERYINDEX', filter);
        }
        catch(error) {
            return this.handleError(error);
        }
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
 * @param count The 'COUNT' optional parameter
 * @param aggregation The 'AGGREGATION' optional parameter
 * @param aggregation.type The type of the 'AGGREGATION' command
 * @param aggregation.timeBucket The time bucket of the 'AGGREGATION' command
 */
export type TSRangeOptions = {
    count?: number,
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