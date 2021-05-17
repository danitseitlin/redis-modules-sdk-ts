import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisBloomTDigest extends Module {

    /**
     * Initializing the RedisBloom TDigest object
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
        return await this.sendCommand('TDIGEST.CREATE', [key, `${compression}`]);
    }

    /**
     * Reset the sketch to zero - empty out the sketch and re-initialize it
     * @param key The name of the sketch
     * @returns OK on success, error otherwise
     */
    async reset(key: string): Promise<'OK'> {
        return await this.sendCommand('TDIGEST.RESET', [key]);
    }

    /**
     * Adds one or more samples to a sketch
     * @param key The name of the sketch
     * @param parameters The parameters of the command
     * @returns OK on success, error otherwise
     */
    async add(key: string, parameters: TDigestAddParameters[]): Promise<'OK'> {  
        let args = [key]
        for(const pair of parameters)
            args = args.concat([`${pair.value}`, `${pair.weight}`])
        return await this.sendCommand('TDIGEST.ADD', args);
    }

    /**
     * Merges all of the values from 'from' to 'this' sketch
     * @param fromKey Sketch to copy values to
     * @param toKey Sketch to copy values from
     * @returns OK on success, error otherwise
     */
    async merge(fromKey: string, toKey: string): Promise<'OK'> {
        return await this.sendCommand('TDIGEST.MERGE', [toKey, fromKey]);
    }

    /**
     * Get minimum value from the sketch. Will return DBL_MAX if the sketch is empty
     * @param key The name of the sketch
     * @returns DBL_MAX if the sketch is empty
     */
    async min(key: string): Promise<number> {
        return await this.sendCommand('TDIGEST.MIN', [key]);
    }

    /**
     * Get maximum value from the sketch. Will return DBL_MIN if the sketch is empty
     * @param key The name of the sketch
     * @returns DBL_MIN if the sketch is empty
     */
    async max(key: string): Promise<number> {
        return await this.sendCommand('TDIGEST.MAX', [key]);
    }

    /**
     * Returns an estimate of the cutoff such that a specified fraction of the data added to this TDigest would be less than or equal to the cutoff
     * @param key The name of the sketch
     * @param quantile The desired fraction ( between 0 and 1 inclusively )
     * @returns Double value estimate of the cutoff such that a specified fraction of the data added to this TDigest would be less than or equal to the cutoff
     */
    async quantile(key: string, quantile: number): Promise<number> {
        return await this.sendCommand('TDIGEST.QUANTILE', [key, quantile]);
    }

    /**
     * Returns the fraction of all points added which are <= value
     * @param key The name of the sketch
     * @param value Upper limit for which the fraction of all points added which are <= value
     * @returns Returns compression, capacity, total merged and unmerged nodes, the total compressions made up to date on that key, and merged and unmerged weight
     */
    async cdf(key: string, value: number): Promise<number> {
        return await this.sendCommand('TDIGEST.CDF', [key, value]);
    }

    /**
     * Returns compression, capacity, total merged and unmerged nodes, the total compressions made up to date on that key, and merged and unmerged weight.
     * @param key The name of the sketch
     */
    async info(key: string): Promise<TDigestInfo> {
        const response = await this.sendCommand('TDIGEST.INFO', [key]);
        return this.handleResponse(response)
    }
}


/**
 * The parameters of the 'TDIGEST.ADD' command
 * @param value The value to add
 * @param weight The weight of this point
 */
export type TDigestAddParameters = {
    value: number,
    weight: number
}

/**
 * The response of the 'TDIGEST.INFO' command
 * @param compression The compression
 * @param capacity The capacity
 * @param 'Merged nodes' The merged nodes
 * @param 'Unmerged nodes' The unmerged nodes
 * @param 'Merged weight' The merged weight
 * @param 'Unmerged weight' The unmerged weight
 * @param 'Total compressions' The total compressions
 */
export type TDigestInfo = {
    Compression: number,
    Capacity: number,
    'Merged nodes': number,
    'Unmerged nodes': number,
    'Merged weight': string,
    'Unmerged weight': string,
    'Total compressions': number
}