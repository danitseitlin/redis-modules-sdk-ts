import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisBloomCuckoo extends Module {
    
    /**
     * Initializing the RedisCuckoo Cuckoo object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: Redis.RedisOptions, public moduleOptions: RedisModuleOptions = {
        handleError: true,
        showDebugLogs: false
    }) {
        super(RedisBloomCuckoo.name, options, moduleOptions)
    }

    /**
     * Adding an item to the cuckoo filter, creating the filter if it does not exist.
     * @param key The name of the filter
     * @param item The item to add
     */
    async add(key: string, item: string): Promise<CFResponse> {
        try {
            return await this.sendCommand('CF.ADD', [key, item])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Adding an item to a cuckoo filter if the item did not exist previously.
     * @param key The name of the filter
     * @param item The item to add
     */
    async addnx(key: string, item: string): Promise<CFResponse> {
        try {
            return await this.sendCommand('CF.ADDNX', [key, item])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Adding one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.
     * @param key The name of the filter
     * @param items Begin the list of items to add
     * @param options The additional optional parameters of the 'CF.INSERT' command
     */
    async insert(key: string, items: string[], options?: CFInsertParameters): Promise<CFResponse[]> {
        try {
            let args = [key];
            if(options !== undefined && options.capacity !== undefined)
                args = args.concat(['CAPACITY', options.capacity.toString()]);
            if(options !== undefined && options.nocreate !== undefined)
                args.push('NOCREATE');
            return await this.sendCommand('CF.INSERT', args.concat(['ITEMS']).concat(items));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Adding one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.
     * @param key The name of the filter
     * @param items The items of the 'CF.INSERT' command
     * @param options The additional optional parameters of the 'CF.INSERTNX' command
     */
    async insertnx(key: string, items: string[], options?: CFInsertParameters): Promise<CFResponse[]> {
        try {
            let args = [key];
            if(options !== undefined && options.capacity !== undefined)
                args = args.concat(['CAPACITY', options.capacity.toString()]);
            if(options !== undefined && options.nocreate !== undefined)
                args.push('NOCREATE');
            return await this.sendCommand('CF.INSERTNX', args.concat(['ITEMS']).concat(items));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Determining whether an item may exist in the Cuckoo Filter or not.
     * @param key The name of the filter
     * @param item The item to check for
     */
    async exists(key: string, item: string): Promise<CFResponse> {
        try {
            return await this.sendCommand('CF.EXISTS', [key, item]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Deleting an item once from the filter. If the item exists only once, it will be removed from the filter.
     * @param key The name of the filter
     * @param item The item to delete from the filter
     */
    async del(key: string, item: string): Promise<CFResponse> {
        try {
            return await this.sendCommand('CF.DEL', [key, item]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Returning the number of times an item may be in the filter.
     * @param key The name of the filter
     * @param item The item to count
     */
    async count(key: string, item: string): Promise<number> {
        try {
            return await this.sendCommand('CF.COUNT', [key, item]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Begining an incremental save of the Cuckoo filter
     * @param key The name of the filter
     * @param iterator Iterator value. This is either 0, or the iterator from a previous invocation of this command
     */
    async scandump(key: string, iterator: number): Promise<string[]> {
        try {
            return await this.sendCommand('CF.SCANDUMP', [key, iterator])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Restoring a filter previously saved using SCANDUMP.
     * @param key The name of the key to restore
     * @param iterator The iterator value associated with data (returned by SCANDUMP )
     * @param data The current data chunk (returned by SCANDUMP ) 
     */
    async loadchunk(key: string, iterator: number, data: string): Promise<'OK'> {
        try {
            return await this.sendCommand('CF.LOADCHUNK', [key, iterator, data]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }
    
    /**
     * Returning information about a key 
     * @param key The name of the filter
     */
    async info(key: string): Promise<string[]> {
        try {
            return await this.sendCommand('CF.INFO', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
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