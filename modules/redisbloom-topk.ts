import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisBloomTopK extends Module {

    /**
     * Initializing the RedisBloom Top-K object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: Redis.RedisOptions, public moduleOptions: RedisModuleOptions = {
        handleError: true,
        showDebugLogs: false
    }) {
        super(RedisBloomTopK.name, options, moduleOptions)
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
        try {
            return await this.sendCommand('TOPK.RESERVE', [key, topk, width, depth, decay]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Adding an item to the data structure. 
     * @param key Name of sketch where item is added.
     * @param items Item/s to be added.
     */
    async add(key: string, items: (number | string)[]): Promise<string[]> {
        try {
            return await this.sendCommand('TOPK.ADD', [key].concat(items as string[]))
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
    async incrby(key: string, items: TOPKIncrbyItems[]): Promise<string[]> {
        try {
            let args = [key];
            for(const item of items) {
                args = args.concat([item.name.toString(), item.increment.toString()])
            }
            return await this.sendCommand('TOPK.INCRBY', args);
        }
        catch(error) {
            return this.handleError(error);
        }
        
    }
    
    /**
     * Checking whether an item is one of Top-K items.
     * @param key Name of sketch where item is queried.
     * @param items Item/s to be queried.
     */
    async query(key: string, items: (string | number)[]): Promise<TOPKResponse[]> {
        try {
            return await this.sendCommand('TOPK.QUERY', [key].concat(items as string[]))
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Returning count for an item.
     * @param key Name of sketch where item is counted.
     * @param items Item/s to be counted.
     */
    async count(key: string, items: (string | number)[]): Promise<number[]> {
        try {
            return await this.sendCommand('TOPK.COUNT', [key].concat(items as string[]));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Returning full list of items in Top K list.
     * @param key Name of sketch where item is counted. 
     */
    async list(key: string): Promise<(string | number)[]> {
        try {
            return await this.sendCommand('TOPK.LIST', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }
    
    /**
     * Returning information about a key 
     * @param key Name of sketch.
     */
    async info(key: string): Promise<(string | number)[]> {
        try {
            return await this.sendCommand('TOPK.INFO', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
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