
import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from '../module.base';
import { RejsonCommander } from './rejson.commander';

export class ReJSON extends Module {

    private RejsonCommander: RejsonCommander
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
        super(ReJSON.name, options, moduleOptions, clusterOptions)
        this.RejsonCommander = new RejsonCommander()
    }

    /**
     * Deleting a JSON key
     * @param key The name of the key
     * @param path The path of the key defaults to root if not provided. Non-existing keys and paths are ignored. Deleting an object's root is equivalent to deleting the key from Redis.
     * @returns The number of paths deleted (0 or 1).
     */
    async del(key: string, path?: string): Promise<number> {
        const command = this.RejsonCommander.del(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Clearing a JSON key
     * @param key The name of the key
     * @param path The path of the key defaults to root if not provided. Non-existing keys and paths are ignored. Deleting an object's root is equivalent to deleting the key from Redis.
     * @returns The number of paths deleted (0 or 1).
     */
    async clear(key: string, path?: string): Promise<number> {
        const command = this.RejsonCommander.clear(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Toggling a JSON key
     * @param key The name of the key
     * @param path The path of the key defaults to root if not provided. Non-existing keys and paths are ignored. Deleting an object's root is equivalent to deleting the key from Redis.
     * @returns The value of the path after the toggle.
     */
    async toggle(key: string, path?: string): Promise<boolean> {
        const command = this.RejsonCommander.toggle(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Setting a new JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @param json The JSON string of the key i.e. '{"x": 4}'
     * @param condition Optional. The condition to set the JSON in.
     * @returns Simple String OK if executed correctly, or Null Bulk if the specified NX or XX conditions were not met. 
     */
    async set(key: string, path: string, json: string, condition?: 'NX' | 'XX'): Promise<"OK"> {
        const command = this.RejsonCommander.set(key, path, json, condition);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving a JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @param parameters Additional parameters to arrange the returned values
     * @returns The value at path in JSON serialized form.
     */
    async get(key: string, path?: string, parameters?: ReJSONGetParameters): Promise<string>{
        const command = this.RejsonCommander.get(key, path, parameters);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving values from multiple keys
     * @param keys A list of keys
     * @param path The path of the keys
     * @returns The values at path from multiple key's. Non-existing keys and non-existing paths are reported as null.
     */
    async mget(keys: string[], path?: string): Promise<string[]> {
        const command = this.RejsonCommander.mget(keys, path);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving the type of a JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @returns Simple String, specifically the type of value. 
     */
    async type(key: string, path?: string): Promise<string> {
        const command = this.RejsonCommander.type(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Increasing JSON key value by number
     * @param key The name of the key
     * @param number The number to increase by
     * @param path The path of the key
     * @returns Bulk String, specifically the stringified new value.
     */
    async numincrby(key: string, number: number, path?: string): Promise<string> {
        const command = this.RejsonCommander.numincrby(key, number, path);
        return await this.sendCommand(command);
    }

    /**
     * Multiplying JSON key value by number
     * @param key The name of the key
     * @param number The number to multiply by
     * @param path The path of the key
     * @returns Bulk String, specifically the stringified new value. 
     */
    async nummultby(key: string, number: number, path?: string): Promise<string> {
        const command = this.RejsonCommander.nummultby(key, number, path);
        return await this.sendCommand(command);
    }

    /**
     * Appending string to JSON key string value
     * @param key The name of the key
     * @param string The string to append to key value 
     * @param path The path of the key
     * @returns Integer, specifically the string's new length.
     */
    async strappend(key: string, string: string, path?: string): Promise<string> {
        const command = this.RejsonCommander.strappend(key, string, path);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving the length of a JSON key value
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the string's length. 
     */
    async strlen(key: string, path?: string): Promise<number | null> {
        const command = this.RejsonCommander.strlen(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Appending string to JSON key array value
     * @param key The name of the key
     * @param items The items to append to an existing JSON array
     * @param path The path of the key
     * @returns Integer, specifically the array's new size.
     */
    async arrappend(key: string, items: string[], path?: string): Promise<number> {
        const command = this.RejsonCommander.arrappend(key, items, path);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving JSON key array item by index
     * @param key The name of the key
     * @param scalar The scalar to filter out a JSON key
     * @param path The path of the key
     * @returns Integer, specifically the position of the scalar value in the array, or -1 if unfound. 
     */
    async arrindex(key: string, scalar: string, path?: string): Promise<number> {
        const command = this.RejsonCommander.arrindex(key, scalar, path);
        return await this.sendCommand(command);
    }
    
    /**
     * Inserting item into JSON key array
     * @param key The name of the key
     * @param index The index to insert the JSON into the array
     * @param json The JSON string to insert into the array
     * @param path The path of the key
     * @returns Integer, specifically the array's new size.
     */
    async arrinsert(key: string, index: number, json: string, path?: string): Promise<number> {
        const command = this.RejsonCommander.arrinsert(key, index, json, path);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving the length of a JSON key array
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the array's length. 
     */
    async arrlen(key: string, path?: string): Promise<number> {
        const command = this.RejsonCommander.arrlen(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Poping an array item by index
     * @param key The name of the key
     * @param index The index of the array item to pop
     * @param path The path of the key
     * @returns Bulk String, specifically the popped JSON value.
     */
    async arrpop(key: string, index: number, path?: string): Promise<string> {
        const command = this.RejsonCommander.arrpop(key, index, path);
        return await this.sendCommand(command);
    }

    /**
     * Triming an array by index range
     * @param key The name of the key
     * @param start The starting index of the trim
     * @param end The ending index of the trim
     * @param path The path of the key
     * @returns Integer, specifically the array's new size. 
     */
    async arrtrim(key: string, start: number, end: number, path?: string): Promise<string> {
        const command = this.RejsonCommander.arrtrim(key, start, end, path);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving an array of JSON keys
     * @param key The name of the key
     * @param path The path of the key
     * @returns Array, specifically the key names in the object as Bulk Strings. 
     */
    async objkeys(key: string, path?: string): Promise<string[]> {
        const command = this.RejsonCommander.objkeys(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving the length of a JSON
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the number of keys in the object.
     */
    async objlen(key: string, path?: string): Promise<number> {
        const command = this.RejsonCommander.objlen(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Executing debug command
     * @param subcommand The subcommand of the debug command
     * @param key The name of the key
     * @param path The path of the key
     * @returns 
        MEMORY returns an integer, specifically the size in bytes of the value
        HELP returns an array, specifically with the help message
     */
    async debug(subcommand: 'MEMORY' | 'HELP', key?: string, path?: string): Promise<string[] | number> {
        const command = this.RejsonCommander.debug(subcommand, key, path);
        return await this.sendCommand(command);
    }

    /**
     * An alias of delCommand
     * @param key The name of the key
     * @param path The path of the key
     * @returns The number of paths deleted (0 or 1).
     */
    async forget(key: string, path?: string): Promise<number> {
        const command = this.RejsonCommander.forget(key, path);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving a JSON key value in RESP protocol
     * @param key The name of the key
     * @param path The path of the key
     * @returns Array, specifically the JSON's RESP form as detailed. 
     */
    async resp(key: string, path?: string): Promise<string[]> {
        const command = this.RejsonCommander.resp(key, path);
        return await this.sendCommand(command);
    }
}

/**
 * The get command additional parameters
 * @param indent Sets the indentation string for nested levels
 * @param newline Sets the string that's printed at the end of each line
 * @param space Sets the string that's put between a key and a value 
 * @param noescape Will disable the sending of \uXXXX escapes for non-ascii characters
 */
export type ReJSONGetParameters = {
    indent?: string,
    newline?: string,
    space?: string,
    noescape?: boolean,
}