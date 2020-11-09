import * as Redis from 'ioredis';

export class RedisGraph {

    public redis: Redis.Redis;

    /**
     * Initializing the RediSearch object
     * @param options The options of the Redis database.
     */
    constructor(public options: Redis.RedisOptions) {}

    /**
     * Connecting to the Redis database with ReJSON module
     */
    async connect(): Promise<void> {
        this.redis = new Redis(this.options);
    }

    /**
     * Disconnecting from the Redis database with ReJSON module
     */
    async disconnect(): Promise<void> {
        await this.redis.quit();
    }

    /**
     * Executing the given query against a specific graph
     * @param name The name of the graph
     * @param query The query to execute
     */
    async query(name: string, query: string): Promise<string[][]> {
        return await this.redis.send_command('GRAPH.QUERY', [name, query])
    }

    /**
     * Executing the given readonly query against a specific graph
     * @param name The name of the graph
     * @param query The query to execute
     */
    async readOnlyQuery(name: string, query: string): Promise<string[][]> {
        return await this.redis.send_command('GRAPH.RO_QUERY', [name, query])
    }

    /**
     * Executing a query and produces an execution plan augmented with metrics for each operation's execution
     * @param name The name of the graph
     * @param query The query to execute 
     * @returns String representation of a query execution plan, with details on results produced by and time spent in each operation.
     */
    async profile(name: string, query: string): Promise<string[]> {
        return await this.redis.send_command('GRAPH.PROFILE', [name, query])
    }

    /**
     * Completely removing the graph and all of its entities
     * @param name The name of the graph
     * @returns String indicating if operation succeeded or failed.
     */
    async delete(name: string): Promise<string> {
        return await this.redis.send_command('GRAPH.DELETE', [name])
    }

    /**
     * Constructing a query execution plan but does not run it. Inspect this execution plan to better understand how your query will get executed
     * @param name The name of the graph
     * @param query The query to execute 
     * @returns String representation of a query execution plan
     */
    async explain(name: string, query: string): Promise<string[]> {
        return await this.redis.send_command('GRAPH.EXPLAIN', [name, query])
    }

    /**
     * Retrieving a list containing up to 10 of the slowest queries
     * @param id The id of the graph
     * @returns A list containing up to 10 of the slowest queries issued against the given graph ID. 
     */
    async slowlog(id: number) {
        return await this.redis.send_command('GRAPH.SLOWLOG', [id])
    }
}