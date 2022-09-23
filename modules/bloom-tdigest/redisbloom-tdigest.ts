import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from '../module.base';
import { BloomTdigestCommander } from './redisbloom-tdigest.commander';
import { TDigestAddParameters, TDigestInfo } from './redisbloom-tdigest.types';

export class RedisBloomTDigest extends Module {

    private bloomTdigestCommander = new BloomTdigestCommander();
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
        super(RedisBloomTDigest.name, options, moduleOptions, clusterOptions)
    }

    /**
     * Allocate the memory and initialize the t-digest
     * @param key The name of the sketch
     * @param compression The compression parameter. 100 is a common value for normal uses. 1000 is extremely large. If no value is passed by default the compression will be 100. 
     * @returns OK on success, error otherwise
     */
    async create(key: string, compression?: number): Promise<'OK'> {
        const command = this.bloomTdigestCommander.create(key, compression);
        return await this.sendCommand(command);
    }

    /**
     * Reset the sketch to zero - empty out the sketch and re-initialize it
     * @param key The name of the sketch
     * @returns OK on success, error otherwise
     */
    async reset(key: string): Promise<'OK'> {
        const command = this.bloomTdigestCommander.reset(key);
        return await this.sendCommand(command);
    }

    /**
     * Adds one or more samples to a sketch
     * @param key The name of the sketch
     * @param parameters The parameters of the command
     * @returns OK on success, error otherwise
     */
    async add(key: string, parameters: TDigestAddParameters[]): Promise<'OK'> {  
        const command = this.bloomTdigestCommander.add(key, parameters);
        return await this.sendCommand(command);
    }

    /**
     * Merges all of the values from 'from' to 'this' sketch
     * @param fromKey Sketch to copy values to
     * @param toKey Sketch to copy values from
     * @returns OK on success, error otherwise
     */
    async merge(fromKey: string, toKey: string): Promise<'OK'> {
        const command = this.bloomTdigestCommander.merge(fromKey, toKey);
        return await this.sendCommand(command);
    }

    /**
     * Get minimum value from the sketch. Will return DBL_MAX if the sketch is empty
     * @param key The name of the sketch
     * @returns DBL_MAX if the sketch is empty
     */
    async min(key: string): Promise<number> {
        const command = this.bloomTdigestCommander.min(key);
        return await this.sendCommand(command);
    }

    /**
     * Get maximum value from the sketch. Will return DBL_MIN if the sketch is empty
     * @param key The name of the sketch
     * @returns DBL_MIN if the sketch is empty
     */
    async max(key: string): Promise<number> {
        const command = this.bloomTdigestCommander.max(key);
        return await this.sendCommand(command);
    }

    /**
     * Returns an estimate of the cutoff such that a specified fraction of the data added to this TDigest would be less than or equal to the cutoff
     * @param key The name of the sketch
     * @param quantile The desired fraction ( between 0 and 1 inclusively )
     * @returns Double value estimate of the cutoff such that a specified fraction of the data added to this TDigest would be less than or equal to the cutoff
     */
    async quantile(key: string, quantile: number): Promise<number> {
        const command = this.bloomTdigestCommander.quantile(key, quantile);
        return await this.sendCommand(command);
    }

    /**
     * Returns the fraction of all points added which are <= value
     * @param key The name of the sketch
     * @param value Upper limit for which the fraction of all points added which are <= value
     * @returns Returns compression, capacity, total merged and unmerged nodes, the total compressions made up to date on that key, and merged and unmerged weight
     */
    async cdf(key: string, value: number): Promise<number> {
        const command = this.bloomTdigestCommander.cdf(key, value);
        return await this.sendCommand(command);
    }

    /**
     * Returns compression, capacity, total merged and unmerged nodes, the total compressions made up to date on that key, and merged and unmerged weight.
     * @param key The name of the sketch
     */
    async info(key: string): Promise<TDigestInfo> {
        const command = this.bloomTdigestCommander.info(key);
        const response = await this.sendCommand(command);
        return this.handleResponse(response)
    }
}