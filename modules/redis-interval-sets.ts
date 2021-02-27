import * as Redis from 'ioredis';
import { Module } from './module.base';

export class RedisIntervalSets extends Module {

    /**
     * Initializing the RedisIntervalSets object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: Redis.RedisOptions, throwError = true) {
        super(RedisIntervalSets.name, options, throwError)
    }

    /**
     * 
     * @param key 
     * @param sets 
     */
    async set(key: string, sets: RISSet[]): Promise<'OK'> {
        try {
            let args: (number | string)[] = [key];
            for(const set of sets)
                args = args.concat([set.name, set.minimum, set.maximum])
            return await this.redis.send_command('is.set', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * 
     * @param key 
     * @param setNames 
     */
    async get(key: string, setNames?: string[]): Promise<RISSet[]> {
        try {
            let args = [key];
            if(setNames)
                args = args.concat(setNames)
            const response = await this.redis.send_command('is.get', args)
            return this.parseGet(response)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * 
     * @param key 
     * @param setNames 
     */
    async del(key: string, setNames?: string[]): Promise<'OK'> {
        try {
            return await this.redis.send_command('is.del', [key].concat(setNames))
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * 
     * @param key 
     * @param score 
     */
    async score(key: string, score: number): Promise<string[]> {
        try {
            return await this.redis.send_command('is.score', [key, score])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * 
     * @param key 
     * @param score 
     */
    async notScore(key: string, score: number): Promise<string[]> {
        try {
            return await this.redis.send_command('is.not_score', [key, score])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    private parseGet(sets: string[][]): RISSet[] {
        const parsedSets: RISSet[] = [];
        for(const set of sets) {
            if(set.length > 2)
                parsedSets.push({name: set[0], minimum: parseInt(set[1]), maximum: parseInt(set[2])})
            else
                parsedSets.push({minimum: parseInt(set[0]), maximum: parseInt(set[1])})
        }
        return parsedSets;
    }
}

export type RISSet = {
    name?: string,
    minimum: number,
    maximum: number
}
