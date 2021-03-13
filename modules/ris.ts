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
     * Adding an interval set 
     * @param key The name of the key
     * @param sets A list of sets to create. At least 1 set is required.
     */
    async add(key: string, sets: RISSet[]): Promise<'OK'> {
        try {
            let args: (number | string)[] = [key];
            for(const set of sets)
                args = args.concat([set.name, set.minimum, set.maximum])
            return await this.redis.send_command('iset.add', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving all of key interval sets/a single set.
     * @param key The name of the key
     * @param setName Optional. The name of specific set. If not passed all interval sets under key will be retrieved. 
     */
    async get(key: string, setName?: string): Promise<RISSet[]> {
        try {
            const args = [key];
            if(setName)
                args.push(setName)
            const response = await this.redis.send_command('iset.get', args)
            return this.parseGet(response)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Deleting a all interval sets under a key, or a single/list of specific set/s.
     * @param key The name of the key
     * @param setNames Optional. A list of set names to delete. If not passed all interval sets under key will be removed. 
     */
    async del(key: string, setNames?: string[]): Promise<'OK'> {
        try {
            return await this.redis.send_command('iset.del', [key].concat(setNames))
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving all sets under a key that have a specific score in their range.
     * @param key The name of the key
     * @param score The score of the set
     */
    async score(key: string, score: number): Promise<string[]> {
        try {
            return await this.redis.send_command('iset.score', [key, score])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving all sets under a key that don't have a specific score in their range.
     * @param key The name of the key
     * @param score The score of the set
     */
    async notScore(key: string, score: number): Promise<string[]> {
        try {
            return await this.redis.send_command('iset.not_score', [key, score])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Parsing the iset.get command response
     * @param sets The list of sets
     */
    private parseGet(sets: string[][]): RISSet[] {
        const parsedSets: RISSet[] = [];
        for(const set of sets) {
            if(set.length > 2)
                parsedSets.push({name: set[0], minimum: parseInt(set[1]), maximum: parseInt(set[2])})
            else
                return [{minimum: parseInt(set[0]), maximum: parseInt(set[1])}]
        }
        return parsedSets;
    }
}

/**
 * The Interval Set object
 * @param name The name of the interval set
 * @param minimum The minimum score of the interval set
 * @param maximum The maximum score of the interval set
 */
export type RISSet = {
    name?: string,
    minimum: number,
    maximum: number
}
