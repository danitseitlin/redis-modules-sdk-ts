import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from '../module.base';
import { BloomCuckooCommander } from './redisbloom-cuckoo.commander';
import { CFInsertParameters, CFReserveParameters, CFResponse } from './redisbloom-cuckoo.types';

export class RedisBloomCuckoo extends Module {
    
    private bloomCuckooCommander = new BloomCuckooCommander();
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
        const command = this.bloomCuckooCommander.reserve(key, capacity, options)
        return await this.sendCommand(command);
    }

    /**
     * Adding an item to the cuckoo filter, creating the filter if it does not exist.
     * @param key The name of the filter
     * @param item The item to add
     */
    async add(key: string, item: string): Promise<CFResponse> {
        const command = this.bloomCuckooCommander.add(key, item);
        return await this.sendCommand(command);
    }

    /**
     * Adding an item to a cuckoo filter if the item did not exist previously.
     * @param key The name of the filter
     * @param item The item to add
     */
    async addnx(key: string, item: string): Promise<CFResponse> {
        const command = this.bloomCuckooCommander.addnx(key, item);
        return await this.sendCommand(command);
    }

    /**
     * Adding one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.
     * @param key The name of the filter
     * @param items Begin the list of items to add
     * @param options The additional optional parameters of the 'CF.INSERT' command
     */
    async insert(key: string, items: string[], options?: CFInsertParameters): Promise<CFResponse[]> {
        const command = this.bloomCuckooCommander.insert(key, items, options);
        return await this.sendCommand(command);
    }

    /**
     * Adding one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.
     * @param key The name of the filter
     * @param items The items of the 'CF.INSERT' command
     * @param options The additional optional parameters of the 'CF.INSERTNX' command
     */
    async insertnx(key: string, items: string[], options?: CFInsertParameters): Promise<CFResponse[]> {
        const command = this.bloomCuckooCommander.insertnx(key, items, options);
        return await this.sendCommand(command);
    }

    /**
     * Determining whether an item may exist in the Cuckoo Filter or not.
     * @param key The name of the filter
     * @param item The item to check for
     */
    async exists(key: string, item: string): Promise<CFResponse> {
        const command = this.bloomCuckooCommander.exists(key, item);
        return await this.sendCommand(command);
    }

    /**
     * Deleting an item once from the filter. If the item exists only once, it will be removed from the filter.
     * @param key The name of the filter
     * @param item The item to delete from the filter
     */
    async del(key: string, item: string): Promise<CFResponse> {
        const command = this.bloomCuckooCommander.del(key, item);
        return await this.sendCommand(command);
    }

    /**
     * Returning the number of times an item may be in the filter.
     * @param key The name of the filter
     * @param item The item to count
     */
    async count(key: string, item: string): Promise<number> {
        const command = this.bloomCuckooCommander.count(key, item);
        return await this.sendCommand(command);
    }

    /**
     * Begining an incremental save of the Cuckoo filter
     * @param key The name of the filter
     * @param iterator Iterator value. This is either 0, or the iterator from a previous invocation of this command
     */
    async scandump(key: string, iterator: number): Promise<string[]> {
        const command = this.bloomCuckooCommander.scandump(key, iterator);
        return await this.sendCommand(command);
    }

    /**
     * Restoring a filter previously saved using SCANDUMP.
     * @param key The name of the key to restore
     * @param iterator The iterator value associated with data (returned by SCANDUMP )
     * @param data The current data chunk (returned by SCANDUMP ) 
     */
    async loadchunk(key: string, iterator: number, data: string): Promise<'OK'> {
        const command = this.bloomCuckooCommander.loadchunk(key, iterator, data);
        return await this.sendCommand(command);
    }
    
    /**
     * Returning information about a key 
     * @param key The name of the filter
     */
    async info(key: string): Promise<string[]> {
        const command = this.bloomCuckooCommander.info(key);
        return await this.sendCommand(command);
    }
}