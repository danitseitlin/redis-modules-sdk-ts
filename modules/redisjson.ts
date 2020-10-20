
import * as Redis from 'ioredis';

export class Redisjson extends Redis{
    constructor(options: Redis.RedisOptions) {
        super(options)
    }

    async delCommand(key: string, path?: string): Promise<number> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.DEL', parameters)
    }

    async getCommand(key: string, path?: string, parameters?: getParameters): Promise<string>{
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

    async mgetCommand(keys: string[], path?: string): Promise<string[]> {
        const args = keys;
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.MGET', args)
    }

    async setCommand(key: string, path: string, json: string): Promise<"OK"> {
        return await this.send_command('JSON.SET', [key, path, json])
    }

    async typeCommand(key: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.TYPE', args)
    }

    async numincrbyCommand(key: string, number: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(number)
        return await this.send_command('JSON.NUMINCRBY', args)
    }

    async nummultbyCommand(key: string, number: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(number)
        return await this.send_command('JSON.NUMMULTBY', args)
    }

    async strappendCommand(key: string, jsonString: string, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(jsonString);
        return await this.send_command('JSON.STRAPPEND', args);
    }

    async strlenCommand(key: string, path?: string): Promise<number | null> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.STRLEN', args);
    }

    async arrappendCommand(key: string, jsonArray: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(jsonArray);
        return await this.send_command('JSON.ARRAPPEND', args);
    }

    async arrindexCommand(key: string, scalar: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(scalar);
        return await this.send_command('JSON.ARRINDEX', args);
    }
    
    async arrinsertCommand(key: string, index: number, json: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(index.toString());
        args.push(json);
        return await this.send_command('JSON.ARRINSERT', args);
    }

    async arrlenCommand(key: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.ARRLEN', args);
    }

    async arrpopCommand(key: string, index: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(index.toString());
        return await this.send_command('JSON.ARRPOP', args);
    }

    async arrtrimCommand(key: string, start: number, stop: number, path?: string): Promise<string> {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(start.toString());
        args.push(stop.toString());
        return await this.send_command('JSON.ARRTRIM', args);
    }

    async objkeysCommand(key: string, path?: string): Promise<string[]> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.OBJKEYS', args);
    }

    async objlenCommand(key: string, path?: string): Promise<number> {
        const args = [key];
        if(path !== undefined) args.push(path);
        return await this.send_command('JSON.OBJLEN', args);
    }

    async debugCommand(subcommand: 'MEMORY' | 'HELP', key?: string, path?: string): Promise<string[] | number> {
        const args: string[] = [subcommand];
        if(subcommand === 'MEMORY') {
            if(key !== undefined) args.push(key);
            if(path !== undefined) args.push(path);
        }
        return await this.send_command('JSON.DEBUG', args);
    }

    async forgetCommand(key: string, path?: string): Promise<number> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.FORGET', parameters)
    }

    async respCommand(key: string, path?: string): Promise<string[]> {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return await this.send_command('JSON.RESP', parameters)
    }
}

export type getParameters = {
    indent?: string,
    newline?: string,
    space?: string,
    noescape?: boolean,
}