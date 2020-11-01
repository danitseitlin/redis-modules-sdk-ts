
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

    async create(key: string, options: TSCreateOptions) {
        const args = [key];
        if(options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()]);
        if(options.uncompressed === true)
            args.push('UNCOMPRESSED')
        if(options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options.duplicatePolicy !== undefined)
            args.concat(['DUPLICATE_POLICY', options.duplicatePolicy])
        if(options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS');
            for(const label of options.labels) {
                args.concat([label.name, label.value])
            }
        }
        return await this.redis.send_command('TS.CREATE', args)
    }

    async del(key: string) {
        return await this.redis.send_command('DEL', [key])
    }

    async alter(key: string, retention: number , labels?: TSLabel[]) {
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

    async add(key: string, timestamp: string, value: string, options: TSAddOptions) {
        const args = [key, timestamp, value];
        if(options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()])
        if(options.uncompressed === true)
            args.push('UNCOMPRESSED');
        if(options.onDuplicate === true)
            args.push('ON_DUPLICATE');
        if(options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args.concat([label.name, label.value]);
            }
        }
        return await this.redis.send_command('TS.ADD', args);
    }

    async madd(keySets: TSKeySet[]) {
        const args: string[] = []
        for(const keySet of keySets)
            args.concat([keySet.key, keySet.timestamp.toString(), keySet.value]);
        return await this.redis.send_command('TS.MADD', args);   
    }

    async incrby(key: string, value: string, options: TSIncrbyDecrbyOptions) {
        const args = [key, value];
        if(options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()])
        if(options.uncompressed === true)
            args.push('UNCOMPRESSED');
        if(options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args.concat([label.name, label.value]);
            }
        }
        return await this.redis.send_command('TS.INCRBY', args);
    }

    async decrby(key: string, value: string, options: TSIncrbyDecrbyOptions) {
        const args = [key, value];
        if(options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()])
        if(options.uncompressed === true)
            args.push('UNCOMPRESSED');
        if(options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args.concat([label.name, label.value]);
            }
        }
        return await this.redis.send_command('TS.DECRBY', args);
    }
    async createRule(options: TSCreateRule) {
        const args = [options.sourceKey, options.destKey, 'AGGREGATION', options.aggregation, options.timeBucket.toString()]
        return await this.redis.send_command('TS.CREATERULE', args);
    }

    async deleteRule(sourceKey: string, destKey: string) {
        return await this.redis.send_command('TS.DELETERULE', sourceKey, destKey)
    }
    async range(key: string, fromTimestamp: number, toTimestamp: number, options: TSRangeOptions) {
        const args = [key, fromTimestamp.toString(), toTimestamp.toString()];
        if(options.count !== undefined)
            args.concat(['COUNT', options.count.toString()]);
        if(options.aggregation !== undefined)
            args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
        return await this.redis.send_command('TS.RANGE', args)
    }
    async revrange(key: string, fromTimestamp: number, toTimestamp: number, options: TSRangeOptions) {
        const args = [key, fromTimestamp.toString(), toTimestamp.toString()];
        if(options.count !== undefined)
            args.concat(['COUNT', options.count.toString()]);
        if(options.aggregation !== undefined)
            args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
        return await this.redis.send_command('TS.REVRANGE', args)
    }
    async mrange(key: string, fromTimestamp: number, toTimestamp: number, filter: string, options: TSMRangeOptions) {
        const args = [key, fromTimestamp.toString(), toTimestamp.toString()];
        if(options.count !== undefined)
            args.concat(['COUNT', options.count.toString()]);
        if(options.aggregation !== undefined)
            args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
        if(options.withlabels !== undefined)
            args.push('WITHLABELS')
        args.concat(['FILTER', filter])
        return await this.redis.send_command('TS.MRANGE', args)
    }
    
    async mrevrange(key: string, fromTimestamp: number, toTimestamp: number, filter: string, options: TSMRangeOptions) {
        const args = [key, fromTimestamp.toString(), toTimestamp.toString()];
        if(options.count !== undefined)
            args.concat(['COUNT', options.count.toString()]);
        if(options.aggregation !== undefined)
            args.concat(['AGGREGATION', options.aggregation.type, options.aggregation.timeBucket.toString()]);
        if(options.withlabels !== undefined)
            args.push('WITHLABELS')
        args.concat(['FILTER', filter])
        return await this.redis.send_command('TS.MREVRANGE', args)
    }

    async get(key: string) {
        return await this.redis.send_command('TS.GET', key);
    }

    async mget(filter: string, withLabels?: boolean) {
        const args = [filter];
        if(withLabels === true)
            args.push('WITHLABELS');
        return await this.redis.send_command('TS.MGET', args);
    }

    async info(key: string) {
        return await this.redis.send_command('TS.INFO', key);
    }
}

export type TSCreateOptions = {
    retention?: number,
    uncompressed?: boolean,
    chunkSize?: number,
    duplicatePolicy?: string,
    labels?: TSLabel[]
}

export type TSLabel = {
    name: string,
    value: string
}

export type TSAddOptions = {
    retention?: number,
    uncompressed?: boolean,
    chunkSize?: number,
    onDuplicate?: boolean,
    labels?: TSLabel[]
}

export type TSKeySet = {
    key: string,
    timestamp: number,
    value: string
}

export interface TSIncrbyDecrbyOptions extends TSOptions {
    timestamp?: number
}

export type TSOptions = {
    retention?: number,
    uncompressed?: boolean,
    chunkSize?: number,
    labels?: TSLabel[]
}

export type TSCreateRule = {
    sourceKey: string,
    destKey: string,
    aggregation: TSAggregationType,
    timeBucket: number
}

export type TSAggregationType = 'avg' | 'sum' | 'min' | 'max' | 'range' | 'range' | 'count' | 'first' | 'last' | 'std.p' | 'std.s' | 'var.p' | 'var.s' | string;

export type TSRangeOptions = {
    count?: number,
    aggregation?: {
        type: TSAggregationType,
        timeBucket: number
    }
}

export interface TSMRangeOptions extends TSRangeOptions {
    withlabels?: boolean,
    filter?: string
}