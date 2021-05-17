import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';

export class RedisGraph extends Module {

    /**
     * Initializing the RedisGraph object
     * @param options The options of the Redis database.
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     */
    constructor(options: Redis.RedisOptions, public moduleOptions?: RedisModuleOptions) {
        super(RedisGraph.name, options, moduleOptions)
    }

    /**
     * Executing the given query against a specific graph
     * @param name The name of the graph
     * @param query The query to execute
     * @returns Result set
     */
    async query(name: string, query: string): Promise<string[][]> {
        return await this.sendCommand('GRAPH.QUERY', [name, query])
    }

    /**
     * Executing the given readonly query against a specific graph
     * @param name The name of the graph
     * @param query The query to execute
     * @returns Result set
     */
    async readonlyQuery(name: string, query: string): Promise<string[][]> {
        return await this.sendCommand('GRAPH.RO_QUERY', [name, query])
    }

    /**
     * Executing a query and produces an execution plan augmented with metrics for each operation's execution
     * @param name The name of the graph
     * @param query The query to execute 
     * @returns String representation of a query execution plan, with details on results produced by and time spent in each operation.
     */
    async profile(name: string, query: string): Promise<string[]> {
        return await this.sendCommand('GRAPH.PROFILE', [name, query])
    }

    /**
     * Completely removing the graph and all of its entities
     * @param name The name of the graph
     * @returns String indicating if operation succeeded or failed.
     */
    async delete(name: string): Promise<string> {
        return await this.sendCommand('GRAPH.DELETE', [name])
    }

    /**
     * Constructing a query execution plan but does not run it. Inspect this execution plan to better understand how your query will get executed
     * @param name The name of the graph
     * @param query The query to execute 
     * @returns String representation of a query execution plan
     */
    async explain(name: string, query: string): Promise<string[]> {
        return await this.sendCommand('GRAPH.EXPLAIN', [name, query])
    }

    /**
     * Retrieving a list containing up to 10 of the slowest queries
     * @param id The id of the graph
     * @returns A list containing up to 10 of the slowest queries issued against the given graph ID. 
     */
    async slowlog(id: number): Promise<string[]> {
        return await this.sendCommand('GRAPH.SLOWLOG', [id])
    }

    /**
     * Retrieves, describes and sets runtime configuration options
     * @param command The command type
     * @param option The option
     * @param value In case of 'SET' command, a valid value to set
     * @returns If 'SET' command, returns 'OK' for valid runtime-settable option names and values. If 'GET' command, returns a string with the current option's value.
     */
    async config(command: 'GET' | 'SET' | 'HELP', option: string, value?: string): Promise<GraphConfigInfo | 'OK' | string | number> {
        const args = [command, option];
        if(command === 'SET')
            args.push(value);
        const response = await this.sendCommand('GRAPH.CONFIG', args);
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
