import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from '../module.base';
import { BloomTopkCommander } from './redisbloom-topk.commander';

export class RedisBloomTopK extends Module {

    private bloomTopkCommander = new BloomTopkCommander();
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
        super(RedisBloomTopK.name, options, moduleOptions, clusterOptions)
    }

    /**
     * Initializing a TopK with specified parameters
     * @param key The key under which the sketch is to be found. 
     * @param topk The number of top occurring items to keep. 
     * @param width The number of counters kept in each array. 
     * @param depth The number of arrays. 
     * @param decay The probability of reducing a counter in an occupied bucket. It is raised to power of it's counter (decay ^ bucket[i].counter). Therefore, as the counter gets higher, the chance of a reduction is being reduced. 
     */
    async reserve(key: string, topk: number, width: number, depth: number, decay: number): Promise<'OK'> {
        const command = this.bloomTopkCommander.reserve(key, topk, width, depth, decay);
        return await this.sendCommand(command);
    }

    /**
     * Adding an item to the data structure. 
     * @param key Name of sketch where item is added.
     * @param items Item/s to be added.
     */
    async add(key: string, items: (number | string)[]): Promise<string[]> {
        const command = this.bloomTopkCommander.add(key, items);
        return await this.sendCommand(command);
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    async incrby(key: string, items: TOPKIncrbyItems[]): Promise<string[]> {
        const command = this.bloomTopkCommander.incrby(key, items);
        return await this.sendCommand(command);
        
    }
    
    /**
     * Checking whether an item is one of Top-K items.
     * @param key Name of sketch where item is queried.
     * @param items Item/s to be queried.
     */
    async query(key: string, items: (string | number)[]): Promise<TOPKResponse[]> {
        const command = this.bloomTopkCommander.query(key, items);
        return await this.sendCommand(command);
    }

    /**
     * Returning count for an item.
     * @param key Name of sketch where item is counted.
     * @param items Item/s to be counted.
     */
    async count(key: string, items: (string | number)[]): Promise<number[]> {
        const command = this.bloomTopkCommander.count(key, items);
        return await this.sendCommand(command);
    }

    /**
     * Returning full list of items in Top K list.
     * @param key Name of sketch where item is counted. 
     */
    async list(key: string): Promise<(string | number)[]> {
        const command = this.bloomTopkCommander.list(key);
        return await this.sendCommand(command);
    }
    
    /**
     * Returning information about a key 
     * @param key Name of sketch.
     */
    async info(key: string): Promise<(string | number)[]> {
        const command = this.bloomTopkCommander.info(key);
        return await this.sendCommand(command);
    }
}

/**
 * The response of the TOPK commands
 * @param 1 Stands for 'true'
 * @param 0 Stands for 'false'
 */
export type TOPKResponse = '1' | '0';

/**
 * The sets of the incrby items (and increments)
 * @param item The item name which counter to be increased.
 * @param increment The counter to be increased by this integer.
 */
export type TOPKIncrbyItems = {
    name: string | number,
    increment: number
}