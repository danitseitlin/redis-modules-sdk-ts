import * as Redis from 'ioredis';
import { Module } from './module.base';

export class RedisGraph extends Module {

    /**
     * Initializing the RedisGraph object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: Redis.RedisOptions, throwError = true) {
        super(options, throwError)
    }

    /**
     * Executing the given query against a specific graph
     * @param name The name of the graph
     * @param query The query to execute
     * @returns Result set
     */
    async query(name: string, query: string): Promise<string[][]> {
        try {
            return await this.redis.send_command('GRAPH.QUERY', [name, query])
        }
        catch(error) {
            return this.handleError(`${RedisGraph.name}: ${error}`);
        }
    }

    /**
     * Executing the given readonly query against a specific graph
     * @param name The name of the graph
     * @param query The query to execute
     * @returns Result set
     */
    async readonlyQuery(name: string, query: string): Promise<string[][]> {
        try {
            return await this.redis.send_command('GRAPH.RO_QUERY', [name, query])
        }
        catch(error) {
            return this.handleError(`${RedisGraph.name}: ${error}`);
        }
    }

    /**
     * Executing a query and produces an execution plan augmented with metrics for each operation's execution
     * @param name The name of the graph
     * @param query The query to execute 
     * @returns String representation of a query execution plan, with details on results produced by and time spent in each operation.
     */
    async profile(name: string, query: string): Promise<string[]> {
        try {
            return await this.redis.send_command('GRAPH.PROFILE', [name, query])
        }
        catch(error) {
            return this.handleError(`${RedisGraph.name}: ${error}`);
        }
    }

    /**
     * Completely removing the graph and all of its entities
     * @param name The name of the graph
     * @returns String indicating if operation succeeded or failed.
     */
    async delete(name: string): Promise<string> {
        try {
            return await this.redis.send_command('GRAPH.DELETE', [name])
        }
        catch(error) {
            return this.handleError(`${RedisGraph.name}: ${error}`);
        }
    }

    /**
     * Constructing a query execution plan but does not run it. Inspect this execution plan to better understand how your query will get executed
     * @param name The name of the graph
     * @param query The query to execute 
     * @returns String representation of a query execution plan
     */
    async explain(name: string, query: string): Promise<string[]> {
        try {
            return await this.redis.send_command('GRAPH.EXPLAIN', [name, query])
        }
        catch(error) {
            return this.handleError(`${RedisGraph.name}: ${error}`);
        }
    }

    /**
     * Retrieving a list containing up to 10 of the slowest queries
     * @param id The id of the graph
     * @returns A list containing up to 10 of the slowest queries issued against the given graph ID. 
     */
    async slowlog(id: number): Promise<string[]> {
        try {
            return await this.redis.send_command('GRAPH.SLOWLOG', [id])
        }
        catch(error) {
            return this.handleError(`${RedisGraph.name}: ${error}`);
        }
    }

    /**
     * Retrieves, describes and sets runtime configuration options
     * @param command The command type
     * @param option The option
     * @param value In case of 'SET' command, a valid value to set
     * @returns If 'SET' command, returns 'OK' for valid runtime-settable option names and values. If 'GET' command, returns a string with the current option's value.
     */
    async config(command: 'GET' | 'SET' | 'HELP', option: string, value?: string): Promise<(number | string)[] | 'OK'> {
        try {
            const args = [command, option];
            if(command === 'SET')
                args.push(value);
            return await this.redis.send_command('GRAPH.CONFIG', args);
        }
        catch(error) {
            return this.handleError(`${RedisGraph.name}: ${error}`);
        }
    }
}
