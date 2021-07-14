import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisBloomCMK extends Module {

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
        return await this.sendCommand('CMS.INITBYDIM', [key, width, depth]);
    }

    /**
     * Initializes a Count-Min Sketch to accommodate requested capacity.
     * @param key The name of the sketch.
     * @param errorSize Estimate size of error. The error is a percent of total counted items. This effects the width of the sketch.
     * @param probability The desired probability for inflated count.
     */
    async initbyprob(key: string, errorSize: number, probability: number): Promise<'OK'> {
        return await this.sendCommand('CMS.INITBYPROB', [key, errorSize, probability]);
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    async incrby(key: string, items: CMKIncrbyItems[]): Promise<number[]> {
        let args = [key];
        for(const item of items)
            args = args.concat([item.name.toString(), item.increment.toString()])
        return await this.sendCommand('CMS.INCRBY', args);
    }

    /**
     * Returns count for item's.
     * @param key The name of the sketch.
     * @param items A list of items.
     */
    async query(key: string, items: string[]): Promise<number[]> {
        return await this.sendCommand('CMS.QUERY', [key].concat(items));
    }

    /**
     * Merges several sketches into one sketch.
     * @param dest The name of destination sketch.
     * @param numKeys The number of sketches to be merged.
     * @param sources The names of source sketches to be merged. 
     * @param weights A multiple of each sketch. Default =1.
     */
    async merge(dest: string, numKeys: number, sources: string[], weights?: number[]): Promise<'OK'> {
        let args = [dest, numKeys];
        args = args.concat(sources);
        if(weights !== undefined && weights.length > 0) {
            args.push('WEIGHTS');
            for(const weight of weights)
                args.push(weight.toString());
        }
        return await this.sendCommand('CMS.MERGE', args);
    }

    /**
     * Returning information about a key 
     * @param key The key of the 'CMS.INFO' command
     */
    async info(key: string): Promise<string[]> {
        return await this.sendCommand('CMS.INFO', [key]);
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