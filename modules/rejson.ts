
import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class ReJSON extends Module {

    /**
     * Initializing the ReJSON object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: Redis.RedisOptions, public moduleOptions: RedisModuleOptions = {
        handleError: true,
        showDebugLogs: true
    }) {
        super(ReJSON.name, options, moduleOptions)
    }

    /**
     * Deleting a JSON key
     * @param key The name of the key
     * @param path The path of the key defaults to root if not provided. Non-existing keys and paths are ignored. Deleting an object's root is equivalent to deleting the key from Redis.
     * @returns The number of paths deleted (0 or 1).
     */
    async del(key: string, path?: string): Promise<number> {
        try {
            const parameters = [key];
            if(path !== undefined) parameters.push(path)
            return await this.sendCommand('JSON.DEL', parameters)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Setting a new JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @param json The JSON string of the key i.e. '{"x": 4}'
     * @returns Simple String OK if executed correctly, or Null Bulk if the specified NX or XX conditions were not met. 
     */
    async set(key: string, path: string, json: string): Promise<"OK"> {
        try {
            return await this.sendCommand('JSON.SET', [key, path, json])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving a JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @param parameters Additional parameters to arrange the returned values
     * @returns The value at path in JSON serialized form.
     */
    async get(key: string, path?: string, parameters?: ReJSONGetParameters): Promise<string>{
        try {
            const args = [key];
            for(const parameter in parameters) {
                const name = parameter.toUpperCase();
                const value = parameters[parameter];
                args.push(name);
                if(typeof value !== 'boolean')
                    args.push(value);
            }
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.GET', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving values from multiple keys
     * @param keys A list of keys
     * @param path The path of the keys
     * @returns The values at path from multiple key's. Non-existing keys and non-existing paths are reported as null.
     */
    async mget(keys: string[], path?: string): Promise<string[]> {
        try {
            const args = keys;
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.MGET', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving the type of a JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @returns Simple String, specifically the type of value. 
     */
    async type(key: string, path?: string): Promise<string> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.TYPE', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Increasing JSON key value by number
     * @param key The name of the key
     * @param number The number to increase by
     * @param path The path of the key
     * @returns Bulk String, specifically the stringified new value.
     */
    async numincrby(key: string, number: number, path?: string): Promise<string> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            args.push(number.toString())
            return await this.sendCommand('JSON.NUMINCRBY', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Multiplying JSON key value by number
     * @param key The name of the key
     * @param number The number to multiply by
     * @param path The path of the key
     * @returns Bulk String, specifically the stringified new value. 
     */
    async nummultby(key: string, number: number, path?: string): Promise<string> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            args.push(number.toString())
            return await this.sendCommand('JSON.NUMMULTBY', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Appending string to JSON key string value
     * @param key The name of the key
     * @param string The string to append to key value 
     * @param path The path of the key
     * @returns Integer, specifically the string's new length.
     */
    async strappend(key: string, string: string, path?: string): Promise<string> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.STRAPPEND', args.concat(string));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving the length of a JSON key value
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the string's length. 
     */
    async strlen(key: string, path?: string): Promise<number | null> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.STRLEN', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Appending string to JSON key array value
     * @param key The name of the key
     * @param items The items to append to an existing JSON array
     * @param path The path of the key
     * @returns Integer, specifically the array's new size.
     */
    async arrappend(key: string, items: string[], path?: string): Promise<number> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.ARRAPPEND', args.concat(items));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving JSON key array item by index
     * @param key The name of the key
     * @param scalar The scalar to filter out a JSON key
     * @param path The path of the key
     * @returns Integer, specifically the position of the scalar value in the array, or -1 if unfound. 
     */
    async arrindex(key: string, scalar: string, path?: string): Promise<number> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            args.push(scalar);
            return await this.sendCommand('JSON.ARRINDEX', args);
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            args.push(index.toString());
            args.push(json);
            return await this.sendCommand('JSON.ARRINSERT', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving the length of a JSON key array
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the array's length. 
     */
    async arrlen(key: string, path?: string): Promise<number> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.ARRLEN', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Poping an array item by index
     * @param key The name of the key
     * @param index The index of the array item to pop
     * @param path The path of the key
     * @returns Bulk String, specifically the popped JSON value.
     */
    async arrpop(key: string, index: number, path?: string): Promise<string> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            args.push(index.toString());
            return await this.sendCommand('JSON.ARRPOP', args);
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            args.push(start.toString());
            args.push(end.toString());
            return await this.sendCommand('JSON.ARRTRIM', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving an array of JSON keys
     * @param key The name of the key
     * @param path The path of the key
     * @returns Array, specifically the key names in the object as Bulk Strings. 
     */
    async objkeys(key: string, path?: string): Promise<string[]> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.OBJKEYS', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving the length of a JSON
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the number of keys in the object.
     */
    async objlen(key: string, path?: string): Promise<number> {
        try {
            const args = [key];
            if(path !== undefined) args.push(path);
            return await this.sendCommand('JSON.OBJLEN', args);
        }
        catch(error) {
            return this.handleError(error);
        }
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
        try {
            const args: string[] = [subcommand];
            if(subcommand === 'MEMORY') {
                if(key !== undefined) args.push(key);
                if(path !== undefined) args.push(path);
            }
            return await this.sendCommand('JSON.DEBUG', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * An alias of delCommand
     * @param key The name of the key
     * @param path The path of the key
     * @returns The number of paths deleted (0 or 1).
     */
    async forget(key: string, path?: string): Promise<number> {
        try {
            const parameters = [key];
            if(path !== undefined) parameters.push(path)
            return await this.sendCommand('JSON.FORGET', parameters)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving a JSON key value in RESP protocol
     * @param key The name of the key
     * @param path The path of the key
     * @returns Array, specifically the JSON's RESP form as detailed. 
     */
    async resp(key: string, path?: string): Promise<string[]> {
        try {
            const parameters = [key];
            if(path !== undefined) parameters.push(path)
            return await this.sendCommand('JSON.RESP', parameters)
        }
        catch(error) {
            return this.handleError(error);
        }
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