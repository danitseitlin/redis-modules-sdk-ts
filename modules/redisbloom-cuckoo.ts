import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisBloomCuckoo extends Module {
    
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
        super(RedisBloomCuckoo.name, options, moduleOptions, clusterOptions)
    }

    /**
     * Creating an empty Bloom Cuckoo filter with a given initial capacity.
     * @param key The key under which the filter is to be found
     * @param capacity The number of entries you intend to add to the filter. Performance will begin to degrade after adding more items than this number. The actual degradation will depend on how far the limit has been exceeded. Performance will degrade linearly as the number of entries grow exponentially. 
     * @param options The additional optional parameters
     */
    async reserve(key: string, capacity: number, options?: CFReserveParameters): Promise<'OK'> {
        let args = [key, capacity];
        if(options && options.bucketSize)
            args = args.concat(['BUCKETSIZE', options.bucketSize])
        if(options && options.maxIteractions)
            args = args.concat(['MAXITERATIONS', options.maxIteractions])
        if(options && options.expansion)
            args = args.concat(['EXPANSION', options.expansion])
        return await this.sendCommand('CF.RESERVE', args);
    }

    /**
     * Adding an item to the cuckoo filter, creating the filter if it does not exist.
     * @param key The name of the filter
     * @param item The item to add
     */
    async add(key: string, item: string): Promise<CFResponse> {
        return await this.sendCommand('CF.ADD', [key, item])
    }

    /**
     * Adding an item to a cuckoo filter if the item did not exist previously.
     * @param key The name of the filter
     * @param item The item to add
     */
    async addnx(key: string, item: string): Promise<CFResponse> {
        return await this.sendCommand('CF.ADDNX', [key, item])
    }

    /**
     * Adding one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.
     * @param key The name of the filter
     * @param items Begin the list of items to add
     * @param options The additional optional parameters of the 'CF.INSERT' command
     */
    async insert(key: string, items: string[], options?: CFInsertParameters): Promise<CFResponse[]> {
        let args = [key];
        if(options !== undefined && options.capacity !== undefined)
            args = args.concat(['CAPACITY', options.capacity.toString()]);
        if(options !== undefined && options.nocreate !== undefined)
            args.push('NOCREATE');
        return await this.sendCommand('CF.INSERT', args.concat(['ITEMS']).concat(items));
    }

    /**
     * Adding one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.
     * @param key The name of the filter
     * @param items The items of the 'CF.INSERT' command
     * @param options The additional optional parameters of the 'CF.INSERTNX' command
     */
    async insertnx(key: string, items: string[], options?: CFInsertParameters): Promise<CFResponse[]> {
        let args = [key];
        if(options !== undefined && options.capacity !== undefined)
            args = args.concat(['CAPACITY', options.capacity.toString()]);
        if(options !== undefined && options.nocreate !== undefined)
            args.push('NOCREATE');
        return await this.sendCommand('CF.INSERTNX', args.concat(['ITEMS']).concat(items));
    }

    /**
     * Determining whether an item may exist in the Cuckoo Filter or not.
     * @param key The name of the filter
     * @param item The item to check for
     */
    async exists(key: string, item: string): Promise<CFResponse> {
        return await this.sendCommand('CF.EXISTS', [key, item]);
    }

    /**
     * Deleting an item once from the filter. If the item exists only once, it will be removed from the filter.
     * @param key The name of the filter
     * @param item The item to delete from the filter
     */
    async del(key: string, item: string): Promise<CFResponse> {
        return await this.sendCommand('CF.DEL', [key, item]);
    }

    /**
     * Returning the number of times an item may be in the filter.
     * @param key The name of the filter
     * @param item The item to count
     */
    async count(key: string, item: string): Promise<number> {
        return await this.sendCommand('CF.COUNT', [key, item]);
    }

    /**
     * Begining an incremental save of the Cuckoo filter
     * @param key The name of the filter
     * @param iterator Iterator value. This is either 0, or the iterator from a previous invocation of this command
     */
    async scandump(key: string, iterator: number): Promise<string[]> {
        return await this.sendCommand('CF.SCANDUMP', [key, iterator])
    }

    /**
     * Restoring a filter previously saved using SCANDUMP.
     * @param key The name of the key to restore
     * @param iterator The iterator value associated with data (returned by SCANDUMP )
     * @param data The current data chunk (returned by SCANDUMP ) 
     */
    async loadchunk(key: string, iterator: number, data: string): Promise<'OK'> {
        return await this.sendCommand('CF.LOADCHUNK', [key, iterator, data]);
    }
    
    /**
     * Returning information about a key 
     * @param key The name of the filter
     */
    async info(key: string): Promise<string[]> {
        return await this.sendCommand('CF.INFO', [key]);
    }
}

/**
 * The additional optional parameter of the 'CF.INSERT' command
 * @param capacity The 'CAPACITY' argument. If specified, should be followed by the desired capacity for the filter to be created. This parameter is ignored if the filter already exists. If the filter is automatically created and this parameter is absent, then the default capacity (specified at the module-level) is used.
 * @param nocreate The 'NOCREATE' argument. If specified, indicates that the filter should not be created if it does not already exist. If the filter does not yet exist, an error is returned rather than creating it automatically. This may be used where a strict separation between filter creation and filter addition is desired.
 */
export type CFInsertParameters = {
    capacity?: number,
    nocreate?: boolean,
}

/**
 * The response of the CF commands
 * @param 1 Stands for 'true'
 * @param 0 Stands for 'false'
 */
export type CFResponse = '1' | '0';

/**
 * The additional optional parameters of the 'CF.RESERVE' command
 * @param bucketSize Number of items in each bucket. A higher bucket size value improves the fill rate but also causes a higher error rate and slightly slower performance.
 * @param maxIteractions Number of attempts to swap items between buckets before declaring filter as full and creating an additional filter. A low value is better for performance and a higher number is better for filter fill rate.
 * @param expansion When a new filter is created, its size is the size of the current filter multiplied by expansion . Expansion is rounded to the next 2^n number.
 */
 export type CFReserveParameters = {
    bucketSize?: number,
    maxIteractions?: number,
    expansion?: number
}