
import * as Redis from 'ioredis';

export class ReJSON extends Redis {
    /**
     * Initializing the 
     * @param options 
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
     * @param parameters 
     * @returns Return the value at path in JSON serialized form.
     */
    async getCommand(key: string, path?: string, parameters?: getCommandParameters): Promise<string>{
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
     * 
     * @param key The name of the key
     * @param path The path of the key.
     */
    async typeCommand(key: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.TYPE', args)
    }

    /**
     * 
     * @param key The name of the key
     * @param number 
     * @param path The path of the key.
     */
    async numincrbyCommand(key: string, number: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(number.toString())
        return await this.send_command('JSON.NUMINCRBY', args)
    }

    /**
     * 
     * @param key The name of the key
     * @param number 
     * @param path The path of the key.
     */
    async nummultbyCommand(key: string, number: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(number.toString())
        return await this.send_command('JSON.NUMMULTBY', args)
    }

    /**
     * 
     * @param key The name of the key
     * @param jsonString 
     * @param path The path of the key.
     */
    async strappendCommand(key: string, string: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.STRAPPEND', args.concat(string));
    }

    /**
     * 
     * @param key The name of the key
     * @param path The path of the key.
     */
    async strlenCommand(key: string, path?: string): Promise<number | null> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.STRLEN', args);
    }

    /**
     * 
     * @param key The name of the key
     * @param items 
     * @param path The path of the key.
     */
    async arrappendCommand(key: string, items: any[], path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.ARRAPPEND', args.concat(items));
    }

    /**
     * 
     * @param key The name of the key
     * @param scalar 
     * @param path The path of the key.
     */
    async arrindexCommand(key: string, scalar: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(scalar);
        return await this.send_command('JSON.ARRINDEX', args);
    }
    
    /**
     * 
     * @param key The name of the key
     * @param index 
     * @param json 
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
     * 
     * @param key The name of the key
     * @param path The path of the key.
     */
    async arrlenCommand(key: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.ARRLEN', args);
    }

    /**
     * 
     * @param key The name of the key
     * @param index 
     * @param path The path of the key.
     */
    async arrpopCommand(key: string, index: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(index.toString());
        return await this.send_command('JSON.ARRPOP', args);
    }

    /**
     * 
     * @param key The name of the key
     * @param start 
     * @param stop 
     * @param path The path of the key.
     */
    async arrtrimCommand(key: string, start: number, stop: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(start.toString());
        args.push(stop.toString());
        return await this.send_command('JSON.ARRTRIM', args);
    }

    /**
     * 
     * @param key The name of the key
     * @param path The path of the key.
     */
    async objkeysCommand(key: string, path?: string): Promise<string[]> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.OBJKEYS', args);
    }

    /**
     * 
     * @param key The name of the key
     * @param path The path of the key.
     */
    async objlenCommand(key: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.OBJLEN', args);
    }

    /**
     * 
     * @param subcommand 
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
     * 
     * @param key The name of the key
     * @param path The path of the key.
     */
    async forgetCommand(key: string, path?: string): Promise<number> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.FORGET', parameters)
    }

    /**
     * 
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
 * 
 */
export type getCommandParameters = {
    indent?: string,
    newline?: string,
    space?: string,
    noescape?: boolean,
}