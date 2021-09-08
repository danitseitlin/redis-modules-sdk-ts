import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from '../module.base';
import { BloomCmkCommander } from './redisbloom-cmk.commander';

export class RedisBloomCMK extends Module {

    private bloomCmkCommander = new BloomCmkCommander();
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
        super(RedisBloomCMK.name, options, moduleOptions, clusterOptions)
    }

    /**
     * Initializes a Count-Min Sketch to dimensions specified by user.
     * @param key The name of the sketch.
     * @param width The number of counter in each array. Reduces the error size.
     * @param depth The number of counter-arrays. Reduces the probability for an error of a certain size (percentage of total count).
     */
    async initbydim(key: string, width: number, depth: number): Promise<'OK'> {
        const command = this.bloomCmkCommander.initbydim(key, width, depth)
        return await this.sendCommand(command);
    }

    /**
     * Initializes a Count-Min Sketch to accommodate requested capacity.
     * @param key The name of the sketch.
     * @param errorSize Estimate size of error. The error is a percent of total counted items. This effects the width of the sketch.
     * @param probability The desired probability for inflated count.
     */
    async initbyprob(key: string, errorSize: number, probability: number): Promise<'OK'> {
        const command = this.bloomCmkCommander.initbyprob(key, errorSize, probability);
        return await this.sendCommand(command);
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    async incrby(key: string, items: CMKIncrbyItems[]): Promise<number[]> {
        const command = this.bloomCmkCommander.incrby(key, items);
        return await this.sendCommand(command);
    }

    /**
     * Returns count for item's.
     * @param key The name of the sketch.
     * @param items A list of items.
     */
    async query(key: string, items: string[]): Promise<number[]> {
        const command = this.bloomCmkCommander.query(key, items);
        return await this.sendCommand(command);
    }

    /**
     * Merges several sketches into one sketch.
     * @param dest The name of destination sketch.
     * @param numKeys The number of sketches to be merged.
     * @param sources The names of source sketches to be merged. 
     * @param weights A multiple of each sketch. Default =1.
     */
    async merge(dest: string, numKeys: number, sources: string[], weights?: number[]): Promise<'OK'> {
        const command = this.bloomCmkCommander.merge(dest, numKeys, sources, weights);
        return await this.sendCommand(command);
    }

    /**
     * Returning information about a key 
     * @param key The key of the 'CMS.INFO' command
     */
    async info(key: string): Promise<string[]> {
        const command = this.bloomCmkCommander.info(key);
        return await this.sendCommand(command);
    }
}

/**
 * The sets of the incrby items (and increments)
 * @param name The item name which counter to be increased.
 * @param increment The counter to be increased by this integer.
 */
export type CMKIncrbyItems = {
    name: string,
    increment: number
}