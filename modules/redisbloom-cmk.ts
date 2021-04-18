import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisBloomCMK extends Module {

    /**
     * Initializing the RedisBloom Count-Min Sketch object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: Redis.RedisOptions, public moduleOptions: RedisModuleOptions = {
        handleError: true,
        showDebugLogs: true
    }) {
        super(RedisBloomCMK.name, options, moduleOptions)
    }

    /**
     * Initializes a Count-Min Sketch to dimensions specified by user.
     * @param key The name of the sketch.
     * @param width The number of counter in each array. Reduces the error size.
     * @param depth The number of counter-arrays. Reduces the probability for an error of a certain size (percentage of total count).
     */
    async initbydim(key: string, width: number, depth: number): Promise<'OK'> {
        try {
            return await this.sendCommand('CMS.INITBYDIM', [key, width, depth]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Initializes a Count-Min Sketch to accommodate requested capacity.
     * @param key The name of the sketch.
     * @param errorSize Estimate size of error. The error is a percent of total counted items. This effects the width of the sketch.
     * @param probability The desired probability for inflated count.
     */
    async initbyprob(key: string, errorSize: number, probability: number): Promise<'OK'> {
        try {
            return await this.sendCommand('CMS.INITBYPROB', [key, errorSize, probability]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    async incrby(key: string, items: CMKIncrbyItems[]): Promise<number[]> {
        try {
            let args = [key];
            for(const item of items)
                args = args.concat([item.name.toString(), item.increment.toString()])
            return await this.sendCommand('CMS.INCRBY', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Returns count for item's.
     * @param key The name of the sketch.
     * @param items A list of items.
     */
    async query(key: string, items: string[]): Promise<number[]> {
        try {
            return await this.sendCommand('CMS.QUERY', [key].concat(items));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Merges several sketches into one sketch.
     * @param dest The name of destination sketch.
     * @param numKeys The number of sketches to be merged.
     * @param sources The names of source sketches to be merged. 
     * @param weights A multiple of each sketch. Default =1.
     */
    async merge(dest: string, numKeys: number, sources: string[], weights?: number[]): Promise<'OK'> {
        try {
            let args = [dest, numKeys];
            args = args.concat(sources);
            if(weights !== undefined && weights.length > 0) {
                args.push('WEIGHTS');
                for(const weight of weights)
                    args.push(weight.toString());
            }
            return await this.sendCommand('CMS.MERGE', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Returning information about a key 
     * @param key The key of the 'CMS.INFO' command
     */
    async info(key: string): Promise<string[]> {
        try {
            return await this.sendCommand('CMS.INFO', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
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