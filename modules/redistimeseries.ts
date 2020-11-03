
import * as Redis from 'ioredis';

export class RedisTimeSeries {

    public redis: Redis.Redis;

    /**
     * Initializing the ReJSON object. Initialization starts an active connection to the Redis database
     * @param options The options of the Redis database.
     */
    constructor(public options: Redis.RedisOptions) {}
    
    /**
     * Connecting to the Redis database with ReJSON module
     */
    async connect(): Promise<void> {
        this.redis = new Redis(this.options);
    }

    /**
     * Disconnecting from the Redis database with ReJSON module
     */
    async disconnect(): Promise<void> {
        await this.redis.quit();
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
     */
    async create(key: string, options?: TSCreateOptions): Promise<'OK'> {
        const args = [key];
        if(options !== undefined && options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()]);
        if(options !== undefined && options.uncompressed === true)
            args.push('UNCOMPRESSED')
        if(options !== undefined && options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options !== undefined && options.duplicatePolicy !== undefined)
            args.concat(['DUPLICATE_POLICY', options.duplicatePolicy])
        if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS');
            for(const label of options.labels) {
                args.concat([label.name, label.value])
            }
        }
        return await this.redis.send_command('TS.CREATE', args)
    }

    /**
     * Deleting an existing TS key
     * @param key The key
     */
    async del(key: string): Promise<number> {
        return await this.redis.send_command('DEL', [key])
    }

    /**
     * Altering an existing TS key
     * @param key Required. The key
     * @param retention Optional. The retention time
     * @param labels Optional. The labels to update
     */
    async alter(key: string, retention?: number, labels?: TSLabel[]): Promise<'OK'> {
        const args = [key];
        if(retention !== undefined)
            args.concat(['RETENTION', retention.toString()]);
        if(labels !== undefined && labels.length > 0) {
            args.push('LABELS')
            for(const label of labels) {
                args.concat([label.name, label.value]);
            }
        }
        return await this.redis.send_command('TS.ALTER', args)
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
        const args = [key, timestamp, value];
        if(options !== undefined && options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()])
        if(options !== undefined && options.uncompressed === true)
            args.push('UNCOMPRESSED');
        if(options !== undefined && options.onDuplicate === true)
            args.push('ON_DUPLICATE');
        if(options !== undefined && options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args.concat([label.name, label.value]);
            }
        }
        return await this.redis.send_command('TS.ADD', args);
    }

    /**
     * Appending new samples to a list of series
     * @param keySets A list of key sets
     * @param keySets.key The key
     * @param keySets.timestamp The timestamp
     * @param keySets.value The value
     */
    async madd(keySets: TSKeySet[]) {
        const args: string[] = []
        for(const keySet of keySets) {
            console.log(keySet)
            args.concat([keySet.key, keySet.timestamp, keySet.value]);
            console.log(args)
        }
        console.log(`arguments: ${args}`)
        return await this.redis.send_command('TS.MADD', args);   
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
        const args = [key, value];
        if(options !== undefined && options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()])
        if(options !== undefined && options.uncompressed === true)
            args.push('UNCOMPRESSED');
        if(options !== undefined && options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args.concat([label.name, label.value]);
            }
        }
        return await this.redis.send_command('TS.INCRBY', args);
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
        const args = [key, value];
        if(options !== undefined && options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()])
        if(options !== undefined && options.uncompressed === true)
            args.push('UNCOMPRESSED');
        if(options !== undefined && options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args.concat([label.name, label.value]);
            }
        }
        return await this.redis.send_command('TS.DECRBY', args);
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
        const args = [parameters.sourceKey, parameters.destKey, 'AGGREGATION', parameters.aggregation, parameters.timeBucket.toString()]
        return await this.redis.send_command('TS.CREATERULE', args);
    }

    /**
     * Deleting a compaction rule
     * @param sourceKey The source key
     * @param destKey The dest key
     */
    async deleterule(sourceKey: string, destKey: string): Promise<'OK'> {
        return await this.redis.send_command('TS.DELETERULE', sourceKey, destKey)
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
    async range(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions) {
        const args = [key, fromTimestamp.toString(), toTimestamp.toString()];
        if(options !== undefined && options.count !== undefined)
            args.concat(['COUNT', options.count.toString()]);
        if(options !== undefined && options.aggregation !== undefined)
            args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
        return await this.redis.send_command('TS.RANGE', args)
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
    async revrange(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions) {
        const args = [key, fromTimestamp.toString(), toTimestamp.toString()];
        if(options !== undefined && options.count !== undefined)
            args.concat(['COUNT', options.count.toString()]);
        if(options !== undefined && options.aggregation !== undefined)
            args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
        return await this.redis.send_command('TS.REVRANGE', args)
    }

    /**
     * Querying a range across multiple time-series by filters in forward directions
     * @param key The key
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
    async mrange(key: string, fromTimestamp: string, toTimestamp: string, filter: string, options?: TSMRangeOptions) {
        const args = [key, fromTimestamp, toTimestamp];
        if(options !== undefined && options.count !== undefined)
            args.concat(['COUNT', options.count.toString()]);
        if(options !== undefined && options.aggregation !== undefined)
            args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
        if(options !== undefined && options.withLabels !== undefined)
            args.push('WITHLABELS')
        args.concat(['FILTER', filter])
        return await this.redis.send_command('TS.MRANGE', args)
    }
    
    /**
     * Querying a range across multiple time-series by filters in reverse directions
     * @param key The key
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
    async mrevrange(key: string, fromTimestamp: string, toTimestamp: string, filter: string, options?: TSMRangeOptions) {
        const args = [key, fromTimestamp.toString(), toTimestamp.toString()];
        if(options !== undefined && options.count !== undefined)
            args.concat(['COUNT', options.count.toString()]);
        if(options !== undefined && options.aggregation !== undefined)
            args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
        if(options !== undefined && options.withLabels !== undefined)
            args.push('WITHLABELS')
        args.concat(['FILTER', filter])
        return await this.redis.send_command('TS.MREVRANGE', args)
    }

    /**
     * Retrieving the last sample of a key
     * @param key The key
     */
    async get(key: string): Promise<(string | number)[]> {
        return await this.redis.send_command('TS.GET', key);
    }

    /**
     * Retrieving the last sample of a key by filter
     * @param filter Required. The filter
     * @param withLabels Optional. If to add the 'WITHLABELS' Optional parameter
     */
    async mget(filter: string, withLabels?: boolean) {
        const args: string[] = [];
        if(withLabels === true)
            args.push('WITHLABELS');
        args.concat(['FILTER', filter])
        return await this.redis.send_command('TS.MGET', args);
    }

    /**
     * Retrieving information and statistics on the time-series
     * @param key The key
     */
    async info(key: string) {
        return await this.redis.send_command('TS.INFO', key);
    }

    /**
     * Retrieving all the keys matching the filter list
     * @param filter The filter
     */
    async queryindex(filter: string) {
        return await this.redis.send_command('TS.QUERYINDEX', filter);
    }
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
 */
export interface TSMRangeOptions extends TSRangeOptions {
    withLabels?: boolean,
}