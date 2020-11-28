import * as Redis from 'ioredis';
import { Module } from './module.base';

export class RedisBloom extends Module {

    /**
     * Initializing the RedisBloom object
     * @param options The options of the Redis database.
     */
    constructor(options: Redis.RedisOptions) {
        super(options)
    }

    /**
     * Creating an empty Bloom filter with a given desired error ratio and initial capacity.
     * @param key The key under which the filter is to be found
     * @param errorRate The desired probability for false positives. This should be a decimal value between 0 and 1. For example, for a desired false positive rate of 0.1% (1 in 1000), error_rate should be set to 0.001. The closer this number is to zero, the greater the memory consumption per item and the more CPU usage per operation.
     * @param capacity The number of entries you intend to add to the filter. Performance will begin to degrade after adding more items than this number. The actual degradation will depend on how far the limit has been exceeded. Performance will degrade linearly as the number of entries grow exponentially. 
     * @param options The additional optional parameters
     */
    async reserve(key: string, errorRate: number, capacity: number, options?: BFReserveParameter): Promise<'OK'> {
        const args = [key, errorRate, capacity];
        if(options !== undefined && options.expansion !== undefined)
            args.push(options.expansion);
        if(options !== undefined && options.nonscaling === true)
            args.push('NONSCALING');
        return await this.redis.send_command('BF.RESERVE', args);
    }

    /**
     * Adding an item to the Bloom Filter, creating the filter if it does not yet exist.
     * @param key The key of the 'BF.ADD' command
     * @param item The item of the 'BF.ADD' command
     */
    async add(key: string, item: string): Promise<BFResponse> {
        return await this.redis.send_command('BF.ADD', [key, item])
    }

    /**
     * Adding one or more items to the Bloom Filter, creating the filter if it does not yet exist. This command operates identically to BF.ADD except it allows multiple inputs and returns multiple values     * @param key 
     * @param items The items of the 'BF.MADD' command
     */
    async madd(key: string, items: string[]): Promise<BFResponse[]> {
        return await this.redis.send_command('BF.MADD', [key].concat(items))
    }

    /**
     * Adding one or more items to the bloom filter, by default creating it if it does not yet exist. There are several arguments which may be used to modify this behavior.
     * @param key The key of the 'BF.INSERT' command
     * @param items The items of the 'BF.INSERT' command
     * @param options The additional optional parameters of the 'BF.INSERT' command
     */
    async insert(key: string, items: string[], options?: BFInsertParameters): Promise<BFResponse[]> {
        let args = [key];
        if(options !== undefined && options.capacity !== undefined)
            args = args.concat(['CAPACITY', options.capacity.toString()]);
        if(options !== undefined && options.error !== undefined)
            args = args.concat(['ERROR', options.error]);
        if(options !== undefined && options.expansion !== undefined)
            args = args.concat(['EXPANSION', options.expansion]);
        if(options !== undefined && options.nocreate !== undefined)
            args.push('NOCREATE');
        if(options !== undefined && options.noscaling !== undefined)
            args.push('NOSCALING');
        args.push('ITEMS')
        return await this.redis.send_command('BF.INSERT', args.concat(items));
    }

    /**
     * Determining whether an item may exist in the Bloom Filter or not.
     * @param key The key of the 'BF.EXISTS' command
     * @param item The key of the 'BF.EXISTS' command
     */
    async exists(key: string, item: string): Promise<BFResponse> {
        return await this.redis.send_command('BF.EXISTS', [key, item]);
    }

    /**
     * Determining if one or more items may exist in the filter or not.
     * @param key The key of the 'BF.MEXISTS' command
     * @param items The items of the 'BF.MEXISTS' command
     */
    async mexists(key: string, items: string[]): Promise<BFResponse[]> {
        return await this.redis.send_command('BF.MEXISTS', [key].concat(items))
    }

    /**
     * Begining an incremental save of the bloom filter
     * @param key The key of the 'BF.SCANDUMP' command
     * @param iterator The iterator of the 'BF.SCANDUMP' command
     */
    async scandump(key: string, iterator: number): Promise<string[]> {
        return await this.redis.send_command('BF.SCANDUMP', [key, iterator])
    }

    /**
     * Restoring a filter previously saved using SCANDUMP.
     * @param key The key of the 'BF.LOADCHUNK' command
     * @param iterator The iterator of the 'BF.LOADCHUNK' command
     * @param data The data of the 'BF.LOADCHUNK' command
     */
    async loadchunk(key: string, iterator: number, data: string): Promise<'OK'> {
        return await this.redis.send_command('BF.LOADCHUNK', [key, iterator, data]);
    }

    /**
     * Returning information about a key 
     * @param key The key of the 'BF.INFO' command
     */
    async info(key: string): Promise<string[]> {
        return await this.redis.send_command('BF.INFO', [key]);
    }
}

/**
 * The additional optional parameter of the 'BF.INSERT' command
 * @param capacity The 'CAPACITY' argument. If specified, should be followed by the desired capacity for the filter to be created. This parameter is ignored if the filter already exists. If the filter is automatically created and this parameter is absent, then the default capacity (specified at the module-level) is used.
 * @param error The 'ERROR' argument. If specified, should be followed by the the error ratio of the newly created filter if it does not yet exist. If the filter is automatically created and ERROR is not specified then the default module-level error rate is used.
 * @param expansion The 'EXPANSION' argument. If a new sub-filter is created, its size will be the size of the current filter multiplied by expansion . Default expansion value is 2. This means each subsequent sub-filter will be twice as large as the previous one. 
 * @param nocreate The 'NOCREATE' argument. If specified, indicates that the filter should not be created if it does not already exist. If the filter does not yet exist, an error is returned rather than creating it automatically. This may be used where a strict separation between filter creation and filter addition is desired.
 * @param noscaling The 'NOSCALING' argument. Prevents the filter from creating additional sub-filters if initial capacity is reached. Non-scaling filters requires slightly less memory than their scaling counterparts. 
 */
export type BFInsertParameters = {
    capacity?: number,
    error?: string,
    expansion?: string,
    nocreate?: boolean,
    noscaling?: boolean
}

/**
 * The additional optional parameters of the 'BF.RESERVE' command
 * @param expansion If a new sub-filter is created, its size will be the size of the current filter multiplied by expansion.
 * @param nonscaling Prevents the filter from creating additional sub-filters if initial capacity is reached.
 */
export type BFReserveParameter = {
    expansion?: number,
    nonscaling?: boolean
}

/**
 * The response of the BF commands
 * @param 1 Stands for 'true'
 * @param 0 Stands for 'false'
 */
export type BFResponse = '1' | '0';