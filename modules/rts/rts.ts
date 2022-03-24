import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from '../module.base';
import { RedisTimeSeriesCommander } from './rts.commander';
import {
    TSAddOptions, TSCreateOptions, TSCreateRule, TSIncrbyDecrbyOptions, TSInfo, TSKeySet, TSLabel,
    TSMRangeOptions, TSRangeOptions
} from './rts.types';

export class RedisTimeSeries extends Module {

    private rtsCommander = new RedisTimeSeriesCommander();
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
        const command = this.rtsCommander.create(key, options);
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
        const command = this.rtsCommander.alter(key, retention, labels);
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
        const command = this.rtsCommander.add(key, timestamp, value, options);
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
        const command = this.rtsCommander.madd(keySets);
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
        const command = this.rtsCommander.incrby(key, value, options);
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
        const command = this.rtsCommander.decrby(key, value, options);
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
        const command = this.rtsCommander.createrule(parameters);
        return await this.sendCommand(command);
    }

    /**
     * Deleting a compaction rule
     * @param sourceKey The source key
     * @param destKey The dest key
     */
    async deleterule(sourceKey: string, destKey: string): Promise<'OK'> {
        const command = this.rtsCommander.deleterule(sourceKey, destKey);
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
    async range(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions): Promise<[number, string][]> {
        const command = this.rtsCommander.range(key, fromTimestamp, toTimestamp, options);
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
    async revrange(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions): Promise<[number, string][]> {
        const command = this.rtsCommander.revrange(key, fromTimestamp, toTimestamp, options);
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
        const command = this.rtsCommander.mrange(fromTimestamp, toTimestamp, filter, options);
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
        const command = this.rtsCommander.mrevrange(fromTimestamp, toTimestamp, filter, options);
        return await this.sendCommand(command);
    }
    
    /**
     * Retrieving the last sample of a key
     * @param key The key
     */
    async get(key: string): Promise<(string | number)[]> {
        const command = this.rtsCommander.get(key);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving the last sample of a key by filter
     * @param filter Required. The filter
     * @param withLabels Optional. If to add the 'WITHLABELS' Optional parameter
     */
    async mget(filter: string, withLabels?: boolean): Promise<(string | number)[][]> {
        const command = this.rtsCommander.mget(filter, withLabels);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving information and statistics on the time-series
     * @param key The key
     */
    async info(key: string): Promise<TSInfo> {
        const command = this.rtsCommander.info(key);
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
        const command = this.rtsCommander.queryindex(filter);
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
        const command = this.rtsCommander.del(key, fromTimestamp, toTimestamp);
        return await this.sendCommand(command);
    }
}
