import * as Redis from 'ioredis';
import { BFReserveParameter, BFResponse, BFInsertParameters } from './redisbloom.types';
import { Module, RedisModuleOptions } from '../module.base';
import { BloomCommander } from './redisbloom.commander';

export class RedisBloom extends Module {

    private bloomCommander = new BloomCommander();
    /**
     * Initializing the module object
     * @param clusterNodes The nodes of the cluster
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     * @param clusterOptions The options of the clusters
     */
    constructor(clusterNodes: Redis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: Redis.ClusterOptions)
    /**
     * Initializing the module object
     * @param redisOptions The options of the redis database
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     */
    constructor(redisOptions: Redis.RedisOptions, moduleOptions?: RedisModuleOptions)
    constructor(options: Redis.RedisOptions & Redis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: Redis.ClusterOptions) {
        super(RedisBloom.name, options, moduleOptions, clusterOptions)
    }

    /**
     * Creating an empty Bloom filter with a given desired error ratio and initial capacity.
     * @param key The key under which the filter is to be found
     * @param errorRate The desired probability for false positives. This should be a decimal value between 0 and 1. For example, for a desired false positive rate of 0.1% (1 in 1000), error_rate should be set to 0.001. The closer this number is to zero, the greater the memory consumption per item and the more CPU usage per operation.
     * @param capacity The number of entries you intend to add to the filter. Performance will begin to degrade after adding more items than this number. The actual degradation will depend on how far the limit has been exceeded. Performance will degrade linearly as the number of entries grow exponentially. 
     * @param options The additional optional parameters
     */
    async reserve(key: string, errorRate: number, capacity: number, options?: BFReserveParameter): Promise<'OK'> {
        const command = this.bloomCommander.reserve(key, errorRate, capacity, options);
        return await this.sendCommand(command);
    }

    /**
     * Adding an item to the Bloom Filter, creating the filter if it does not yet exist.
     * @param key The key of the 'BF.ADD' command
     * @param item The item of the 'BF.ADD' command
     */
    async add(key: string, item: string): Promise<BFResponse> {
        const command = this.bloomCommander.add(key, item);
        return await this.sendCommand(command);
    }

    /**
     * Adding one or more items to the Bloom Filter, creating the filter if it does not yet exist. This command operates identically to BF.ADD except it allows multiple inputs and returns multiple values     * @param key 
     * @param items The items of the 'BF.MADD' command
     */
    async madd(key: string, items: string[]): Promise<BFResponse[]> {
        const command = this.bloomCommander.madd(key, items);
        return await this.sendCommand(command);
    }

    /**
     * Adding one or more items to the bloom filter, by default creating it if it does not yet exist. There are several arguments which may be used to modify this behavior.
     * @param key The key of the 'BF.INSERT' command
     * @param items The items of the 'BF.INSERT' command
     * @param options The additional optional parameters of the 'BF.INSERT' command
     */
    async insert(key: string, items: string[], options?: BFInsertParameters): Promise<BFResponse[]> {
        const command = this.bloomCommander.insert(key, items, options);
        return await this.sendCommand(command);
    }

    /**
     * Determining whether an item may exist in the Bloom Filter or not.
     * @param key The key of the 'BF.EXISTS' command
     * @param item The key of the 'BF.EXISTS' command
     */
    async exists(key: string, item: string): Promise<BFResponse> {
        const command = this.bloomCommander.exists(key, item);
        return await this.sendCommand(command);
    }

    /**
     * Determining if one or more items may exist in the filter or not.
     * @param key The key of the 'BF.MEXISTS' command
     * @param items The items of the 'BF.MEXISTS' command
     */
    async mexists(key: string, items: string[]): Promise<BFResponse[]> {
        const command = this.bloomCommander.mexists(key, items);
        return await this.sendCommand(command);
    }

    /**
     * Begining an incremental save of the bloom filter
     * @param key The key of the 'BF.SCANDUMP' command
     * @param iterator The iterator of the 'BF.SCANDUMP' command
     */
    async scandump(key: string, iterator: number): Promise<string[]> {
        const command = this.bloomCommander.scandump(key, iterator);
        return await this.sendCommand(command);
    }

    /**
     * Restoring a filter previously saved using SCANDUMP.
     * @param key The key of the 'BF.LOADCHUNK' command
     * @param iterator The iterator of the 'BF.LOADCHUNK' command
     * @param data The data of the 'BF.LOADCHUNK' command
     */
    async loadchunk(key: string, iterator: number, data: string): Promise<'OK'> {
        const command = this.bloomCommander.loadchunk(key, iterator, data);
        return await this.sendCommand(command);
    }

    /**
     * Returning information about a key 
     * @param key The key of the 'BF.INFO' command
     */
    async info(key: string): Promise<string[]> {
        const command = this.bloomCommander.info(key);
        return await this.sendCommand(command);
    }
}