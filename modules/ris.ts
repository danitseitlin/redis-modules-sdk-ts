import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';
import { RedisIntervalSetsCommander } from './ris.commander';

export class RedisIntervalSets extends Module {

    private risCommander: RedisIntervalSetsCommander
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
        super(RedisIntervalSets.name, options, moduleOptions, clusterOptions)
        this.risCommander = new RedisIntervalSetsCommander()
    }

    /**
     * Adding an interval set 
     * @param key The name of the key
     * @param sets A list of sets to create. At least 1 set is required.
     */
    async add(key: string, sets: RISSet[]): Promise<'OK'> {
        const command = this.risCommander.add(key, sets);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving all of key interval sets/a single set.
     * @param key The name of the key
     * @param setName Optional. The name of specific set. If not passed all interval sets under key will be retrieved. 
     */
    async get(key: string, setName?: string): Promise<RISSet[]> {
        const command = this.risCommander.get(key, setName);
        const response = await this.sendCommand(command);
        return this.parseGet(response);
    }

    /**
     * Deleting a all interval sets under a key, or a single/list of specific set/s.
     * @param key The name of the key
     * @param setNames Optional. A list of set names to delete. If not passed all interval sets under key will be removed. 
     */
    async del(key: string, setNames?: string[]): Promise<'OK'> {
        const command = this.risCommander.del(key, setNames);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving all sets under a key that have a specific score in their range.
     * @param key The name of the key
     * @param score The score of the set
     */
    async score(key: string, score: number): Promise<string[]> {
        const command = this.risCommander.score(key, score);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving all sets under a key that don't have a specific score in their range.
     * @param key The name of the key
     * @param score The score of the set
     */
    async notScore(key: string, score: number): Promise<string[]> {
        const command = this.risCommander.notScore(key, score);
        return await this.sendCommand(command);
    }

    /**
     * Parsing the iset.get command response
     * @param sets The list of sets
     */
    private parseGet(sets: string[][]): RISSet[] {
        const parsedSets: RISSet[] = [];
        for(const set of sets) {
            if(set.length > 2){
                parsedSets.push({name: set[0], minimum: parseInt(set[1]), maximum: parseInt(set[2])})
            }
            else {
                return [{minimum: parseInt(set[0]), maximum: parseInt(set[1])}]
            }
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
