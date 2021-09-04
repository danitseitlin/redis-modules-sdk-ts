import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';
import { Commander } from './redisgraph.commander';

export class RedisGraph extends Module {

    private commander: Commander
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
        super(RedisGraph.name, options, moduleOptions, clusterOptions)
        this.commander = new Commander()
    }

    /**
     * Executing the given query against a specific graph
     * @param name The name of the graph
     * @param query The query to execute
     * @param params The params of the query
     * @returns Result set
     */
    async query(name: string, query: string, params?: {[key: string]: string}): Promise<string[][]> {
        const command = this.commander.query(name, query, params);
        return await this.sendCommand(command);
    }

    /**
     * Executing the given readonly query against a specific graph
     * @param name The name of the graph
     * @param query The query to execute
     * @param params The params of the query
     * @returns Result set
     */
    async readonlyQuery(name: string, query: string, params?: {[key: string]: string}): Promise<string[][]> {
        const command = this.commander.readonlyQuery(name, query, params);
        return await this.sendCommand(command);
    }

    /**
     * Executing a query and produces an execution plan augmented with metrics for each operation's execution
     * @param name The name of the graph
     * @param query The query to execute 
     * @returns String representation of a query execution plan, with details on results produced by and time spent in each operation.
     */
    async profile(name: string, query: string): Promise<string[]> {
        const command = this.commander.profile(name, query);
        return await this.sendCommand(command);
    }

    /**
     * Completely removing the graph and all of its entities
     * @param name The name of the graph
     * @returns String indicating if operation succeeded or failed.
     */
    async delete(name: string): Promise<string> {
        const command = this.commander.delete(name);
        return await this.sendCommand(command);
    }

    /**
     * Constructing a query execution plan but does not run it. Inspect this execution plan to better understand how your query will get executed
     * @param name The name of the graph
     * @param query The query to execute 
     * @returns String representation of a query execution plan
     */
    async explain(name: string, query: string): Promise<string[]> {
        const command = this.commander.explain(name, query);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving a list containing up to 10 of the slowest queries
     * @param id The id of the graph
     * @returns A list containing up to 10 of the slowest queries issued against the given graph ID. 
     */
    async slowlog(id: number): Promise<string[]> {
        const command = this.commander.slowlog(id);
        return await this.sendCommand(command);
    }

    /**
     * Retrieves, describes and sets runtime configuration options
     * @param command The command type
     * @param option The option
     * @param value In case of 'SET' command, a valid value to set
     * @returns If 'SET' command, returns 'OK' for valid runtime-settable option names and values. If 'GET' command, returns a string with the current option's value.
     */
    async config(commandType: 'GET' | 'SET' | 'HELP', option: string, value?: string): Promise<GraphConfigInfo | 'OK' | string | number> {
        const command = this.commander.config(commandType, option, value);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }
}

/**
 * The config information
 * @param CACHE_SIZE The cache size of the module
 * @param ASYNC_DELETE The async delete of the module
 * @param OMP_THREAD_COUNT The omp thread count of the module
 * @param THREAD_COUNT The thread count of the module
 * @param RESULTSET_SIZE The resultset size of the module
 * @param MAINTAIN_TRANSPOSED_MATRICES The maintain transposed matrices of the module
 * @param VKEY_MAX_ENTITY_COUNT The vkey max entity count of the module
 */
export type GraphConfigInfo = {
    CACHE_SIZE: number,
    ASYNC_DELETE: number,
    OMP_THREAD_COUNT: number,
    THREAD_COUNT: number,
    RESULTSET_SIZE: number,
    MAINTAIN_TRANSPOSED_MATRICES: number,
    VKEY_MAX_ENTITY_COUNT: number,
    [key: string]: any
}
