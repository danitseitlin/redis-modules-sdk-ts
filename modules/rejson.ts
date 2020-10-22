
import * as Redis from 'ioredis';

export class ReJSON extends Redis {
    constructor(options: Redis.RedisOptions) {
        super(options)
        this.disconnect();
    }

    /**
     * 
     * @param key 
     * @param path 
     */
    async delCommand(key: string, path?: string): Promise<number> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.DEL', parameters)
    }

    /**
     * 
     * @param key 
     * @param path 
     * @param parameters 
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
     * 
     * @param keys 
     * @param path 
     */
    async mgetCommand(keys: string[], path?: string): Promise<string[]> {
        const args = keys;
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.MGET', args)
    }

    /**
     * 
     * @param key 
     * @param path 
     * @param json 
     */
    async setCommand(key: string, path: string, json: string): Promise<"OK"> {
        return await this.send_command('JSON.SET', [key, path, json])
    }

    /**
     * 
     * @param key 
     * @param path 
     */
    async typeCommand(key: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.TYPE', args)
    }

    /**
     * 
     * @param key 
     * @param number 
     * @param path 
     */
    async numincrbyCommand(key: string, number: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(number)
        return await this.send_command('JSON.NUMINCRBY', args)
    }

    /**
     * 
     * @param key 
     * @param number 
     * @param path 
     */
    async nummultbyCommand(key: string, number: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(number)
        return await this.send_command('JSON.NUMMULTBY', args)
    }

    /**
     * 
     * @param key 
     * @param jsonString 
     * @param path 
     */
    async strappendCommand(key: string, jsonString: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(jsonString);
        return await this.send_command('JSON.STRAPPEND', args);
    }

    /**
     * 
     * @param key 
     * @param path 
     */
    async strlenCommand(key: string, path?: string): Promise<number | null> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.STRLEN', args);
    }

    /**
     * 
     * @param key 
     * @param jsonArray 
     * @param path 
     */
    async arrappendCommand(key: string, jsonArray: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(jsonArray);
        return await this.send_command('JSON.ARRAPPEND', args);
    }

    /**
     * 
     * @param key 
     * @param scalar 
     * @param path 
     */
    async arrindexCommand(key: string, scalar: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(scalar);
        return await this.send_command('JSON.ARRINDEX', args);
    }
    
    /**
     * 
     * @param key 
     * @param index 
     * @param json 
     * @param path 
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
     * @param key 
     * @param path 
     */
    async arrlenCommand(key: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.ARRLEN', args);
    }

    /**
     * 
     * @param key 
     * @param index 
     * @param path 
     */
    async arrpopCommand(key: string, index: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(index.toString());
        return await this.send_command('JSON.ARRPOP', args);
    }

    /**
     * 
     * @param key 
     * @param start 
     * @param stop 
     * @param path 
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
     * @param key 
     * @param path 
     */
    async objkeysCommand(key: string, path?: string): Promise<string[]> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.OBJKEYS', args);
    }

    /**
     * 
     * @param key 
     * @param path 
     */
    async objlenCommand(key: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.OBJLEN', args);
    }

    /**
     * 
     * @param subcommand 
     * @param key 
     * @param path 
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
     * @param key 
     * @param path 
     */
    async forgetCommand(key: string, path?: string): Promise<number> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.FORGET', parameters)
    }

    /**
     * 
     * @param key 
     * @param path 
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