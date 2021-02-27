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
    async set(key: string, sets: RISMember[]): Promise<'OK'> {
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

    async get(key: string, setNames?: string[]) {
        try {
            return await this.redis.send_command('is.get', [key].concat(setNames))
        }
        catch(error) {
            return this.handleError(error);
        }
    }
    async del(key: string, setNames?: string[]) {
        try {
            return await this.redis.send_command('is.del', [key].concat(setNames))
        }
        catch(error) {
            return this.handleError(error);
        }
    }
    async score(key: string, score: number) {
        try {
            return await this.redis.send_command('is.score', [key, score])
        }
        catch(error) {
            return this.handleError(error);
        }
    }
    async notScore(key: string, score: number) {
        try {
            return await this.redis.send_command('is.not_score', [key, score])
        }
        catch(error) {
            return this.handleError(error);
        }
    }
}

export type RISMember = {
    name: string,
    minimum: number,
    maximum: number
}
