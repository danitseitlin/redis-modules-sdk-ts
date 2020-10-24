
import * as Redis from 'ioredis';

export class ReJSON extends Redis {
    /**
     * Initializing the ReJSON object. Initialization starts an active connection to the Redis database
     * @param options The options of the Redis database.
     */
    constructor(options: Redis.RedisOptions) {
        super(options)
    }

    /**
     * Deleting a JSON key
     * @param key The name of the key
     * @param path The path of the key. defaults to root if not provided. Non-existing keys and paths are ignored. Deleting an object's root is equivalent to deleting the key from Redis.
     * @returns The number of parths deleted (0 or 1).
     */
    async delCommand(key: string, path?: string): Promise<number> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.DEL', parameters)
    }

    /**
     * Setting a new JSON key
     * @param key The name of the key
     * @param path The path of the key.
     * @param json The JSON string of the key. i.e. '{"x": 4}'
     * @returns "OK"
     */
    async setCommand(key: string, path: string, json: string): Promise<"OK"> {
        return await this.send_command('JSON.SET', [key, path, json])
    }

    /**
     * Retrieving a JSON key
     * @param key The name of the key
     * @param path The path of the key.
     * @param parameters Additional parameters to arrange the returned values
     * @returns Return the value at path in JSON serialized form.
     */
    async getCommand(key: string, path?: string, parameters?: GetCommandParameters): Promise<string>{
        const args = [key];
        for(const parameter in parameters) {
            const name = parameter.toUpperCase();
            const value = parameters[parameter];
            args.push(name);
            if(typeof value !== 'boolean')
                args.push(value);
        }
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.GET', args)
    }

    /**
     * Retrieving values from multiple keys
     * @param keys A list of keys
     * @param path The path of the keys
     * @returns Returns the values at path from multiple key's. Non-existing keys and non-existing paths are reported as null.
     */
    async mgetCommand(keys: string[], path?: string): Promise<string[]> {
        const args = keys;
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.MGET', args)
    }

    /**
     * Retrieving the type of a JSON key
     * @param key The name of the key
     * @param path The path of the key.
     */
    async typeCommand(key: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.TYPE', args)
    }

    /**
     * Increasing JSON key value by number
     * @param key The name of the key
     * @param number The number to increase by
     * @param path The path of the key.
     */
    async numincrbyCommand(key: string, number: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(number.toString())
        return await this.send_command('JSON.NUMINCRBY', args)
    }

    /**
     * Multiplying JSON key value by number
     * @param key The name of the key
     * @param number The number to multiply by
     * @param path The path of the key.
     */
    async nummultbyCommand(key: string, number: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(number.toString())
        return await this.send_command('JSON.NUMMULTBY', args)
    }

    /**
     * Appending string to JSON key string value
     * @param key The name of the key
     * @param string The string to append to key value 
     * @param path The path of the key.
     */
    async strappendCommand(key: string, string: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.STRAPPEND', args.concat(string));
    }

    /**
     * Retrieving the length of a JSON key value
     * @param key The name of the key
     * @param path The path of the key.
     */
    async strlenCommand(key: string, path?: string): Promise<number | null> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.STRLEN', args);
    }

    /**
     * Appending string to JSON key array value
     * @param key The name of the key
     * @param items The items to append to an existing JSON array
     * @param path The path of the key.
     */
    async arrappendCommand(key: string, items: string[], path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.ARRAPPEND', args.concat(items));
    }

    /**
     * Retrieving JSON key array item by index
     * @param key The name of the key
     * @param scalar The scalar to filter out a JSON key
     * @param path The path of the key.
     */
    async arrindexCommand(key: string, scalar: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(scalar);
        return await this.send_command('JSON.ARRINDEX', args);
    }
    
    /**
     * Inserting item into JSON key array
     * @param key The name of the key
     * @param index The index to insert the JSON into the array
     * @param json The JSON string to insert into the array
     * @param path The path of the key.
     */
    async arrinsertCommand(key: string, index: number, json: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(index.toString());
        args.push(json);
        return await this.send_command('JSON.ARRINSERT', args);
    }

    /**
     * Retrieving the length of a JSON key array
     * @param key The name of the key
     * @param path The path of the key.
     */
    async arrlenCommand(key: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.ARRLEN', args);
    }

    /**
     * Poping an array item by index
     * @param key The name of the key
     * @param index The index of the array item to pop
     * @param path The path of the key.
     */
    async arrpopCommand(key: string, index: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(index.toString());
        return await this.send_command('JSON.ARRPOP', args);
    }

    /**
     * Triming an array by index range
     * @param key The name of the key
     * @param start The starting index of the trim
     * @param end The ending index of the trim
     * @param path The path of the key.
     */
    async arrtrimCommand(key: string, start: number, end: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(start.toString());
        args.push(end.toString());
        return await this.send_command('JSON.ARRTRIM', args);
    }

    /**
     * Retrieving an array of JSON keys
     * @param key The name of the key
     * @param path The path of the key.
     */
    async objkeysCommand(key: string, path?: string): Promise<string[]> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.OBJKEYS', args);
    }

    /**
     * Retrieving the length of a JSON
     * @param key The name of the key
     * @param path The path of the key.
     */
    async objlenCommand(key: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.OBJLEN', args);
    }

    /**
     * Executing debug command
     * @param subcommand The subcommand of the debug command
     * @param key The name of the key
     * @param path The path of the key.
     */
    async debugCommand(subcommand: 'MEMORY' | 'HELP', key?: string, path?: string): Promise<string[] | number> {
        const args: string[] = [subcommand];
        if(subcommand === 'MEMORY') {
            if(key !== undefined) args.push(key);
            if(path !== undefined) args.push(path);
        }
        return await this.send_command('JSON.DEBUG', args);
    }

    /**
     * An alias of delCommand
     * @param key The name of the key
     * @param path The path of the key.
     */
    async forgetCommand(key: string, path?: string): Promise<number> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.FORGET', parameters)
    }

    /**
     * Retrieving a JSON key value in RESP protocol
     * @param key The name of the key
     * @param path The path of the key.
     */
    async respCommand(key: string, path?: string): Promise<string[]> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.RESP', parameters)
    }
}

/**
 * The get command additional parameters
 * @param indent Sets the indentation string for nested levels
 * @param newline Sets the string that's printed at the end of each line
 * @param space Sets the string that's put between a key and a value 
 * @param noescape Will disable the sending of \uXXXX escapes for non-ascii characters
 */
export type GetCommandParameters = {
    indent?: string,
    newline?: string,
    space?: string,
    noescape?: boolean,
}