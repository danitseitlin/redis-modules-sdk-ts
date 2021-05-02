import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisBloomTDigest extends Module {

    /**
     * Initializing the RedisBloom Count-Min Sketch object
     * @param options The options of the Redis database.
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     */
    constructor(options: Redis.RedisOptions, public moduleOptions?: RedisModuleOptions) {
        super(RedisBloomTDigest.name, options, moduleOptions)
    }

    /**
     * Allocate the memory and initialize the t-digest
     * @param key The name of the sketch
     * @param compression The compression parameter. 100 is a common value for normal uses. 1000 is extremely large. See the further notes bellow. 
     * @returns OK on success, error otherwise
     */
    async create(key: string, compression: number): Promise<'OK'> {
        try {
            return await this.sendCommand('TDIGEST.CREATE', [key, `${compression}`]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Reset the sketch to zero - empty out the sketch and re-initialize it
     * @param key The name of the sketch
     * @returns OK on success, error otherwise
     */
    async reset(key: string): Promise<'OK'> {
        try {
            return await this.sendCommand('TDIGEST.RESET', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Adds one or more samples to a sketch
     * @param key The name of the sketch
     * @param parameters The parameters of the command
     * @returns OK on success, error otherwise
     */
    async add(key: string, parameters: TDigestAddParameters[]): Promise<'OK'> {  
        try {
            let args = [key]
            for(const pair of parameters)
                args = args.concat([`${pair.value}`, `${pair.weight}`])
            return await this.sendCommand('TDIGEST.ADD', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Merges all of the values from 'from' to 'this' sketch
     * @param fromKey Sketch to copy values to
     * @param toKey Sketch to copy values from
     * @returns OK on success, error otherwise
     */
    async merge(fromKey: string, toKey: string): Promise<'OK'> {
        try {
            return await this.sendCommand('TDIGEST.MERGE', [toKey, fromKey]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Get minimum value from the sketch. Will return DBL_MAX if the sketch is empty
     * @param key The name of the sketch
     * @returns DBL_MAX if the sketch is empty
     */
    async min(key: string): Promise<number> {
        try {
            return await this.sendCommand('TDIGEST.MIN', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Get maximum value from the sketch. Will return DBL_MIN if the sketch is empty
     * @param key The name of the sketch
     * @returns DBL_MIN if the sketch is empty
     */
    async max(key: string): Promise<number> {
        try {
            return await this.sendCommand('TDIGEST.MAX', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Returns an estimate of the cutoff such that a specified fraction of the data added to this TDigest would be less than or equal to the cutoff
     * @param key The name of the sketch
     * @param quantile The desired fraction ( between 0 and 1 inclusively )
     * @returns Double value estimate of the cutoff such that a specified fraction of the data added to this TDigest would be less than or equal to the cutoff
     */
    async quantile(key: string, quantile: number): Promise<number> {
        try {
            return await this.sendCommand('TDIGEST.QUANTILE', [key, quantile]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Returns the fraction of all points added which are <= value
     * @param key The name of the sketch
     * @param value Upper limit for which the fraction of all points added which are <= value
     * @returns Returns compression, capacity, total merged and unmerged nodes, the total compressions made up to date on that key, and merged and unmerged weight
     */
    async cdf(key: string, value: number): Promise<number> {
        try {
            return await this.sendCommand('TDIGEST.CDF', [key, value]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Returns compression, capacity, total merged and unmerged nodes, the total compressions made up to date on that key, and merged and unmerged weight.
     * @param key The name of the sketch
     */
    async info(key: string) {
        try {
            return await this.sendCommand('TDIGEST.INFO', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }
}


/**
 * 
 */
export type TDigestAddParameters = {
    value: number,
    weight: number
}