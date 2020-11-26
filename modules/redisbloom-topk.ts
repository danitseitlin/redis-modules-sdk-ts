import * as Redis from 'ioredis';

export class RedisBloomTopK {

    public redis: Redis.Redis;

    /**
     * Initializing the RedisBloom Top-K object
     * @param options The options of the Redis database.
     */
    constructor(public options: Redis.RedisOptions) {}

    /**
     * Connecting to the Redis database with RedisBloom Top-K module
     */
    async connect(): Promise<void> {
        this.redis = new Redis(this.options);
    }

    /**
     * Disconnecting from the Redis database with RedisBloom Top-K module
     */
    async disconnect(): Promise<void> {
        await this.redis.quit();
    }

    /**
     * Initializing a TopK with specified parameters
     * @param key The key under which the sketch is to be found. 
     * @param topk The number of top occurring items to keep. 
     * @param width The number of counters kept in each array. 
     * @param depth The number of arrays. 
     * @param decay The probability of reducing a counter in an occupied bucket. It is raised to power of it's counter (decay ^ bucket[i].counter). Therefore, as the counter gets higher, the chance of a reduction is being reduced. 
     */
    async reserve(key: string, topk: number, width: number, depth: number, decay: number): Promise<'OK'> {
        return await this.redis.send_command('TOPK.RESERVE', [key, topk, width, depth, decay]);
    }

    /**
     * Adding an item to the data structure. 
     * @param key Name of sketch where item is added.
     * @param items Item/s to be added.
     */
    async add(key: string, items: (number | string)[]): Promise<string[]> {
        return await this.redis.send_command('TOPK.ADD', [key].concat(items as string[]))
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    async incrby(key: string, items: TOPKIncrbyItems[]): Promise<string[]> {
        let args = [key];
        for(const item of items) {
            args = args.concat([item.name.toString(), item.increment.toString()])
        }
        return await this.redis.send_command('TOPK.INCRBY', args);
    }
    
    /**
     * Checking whether an item is one of Top-K items.
     * @param key Name of sketch where item is queried.
     * @param items Item/s to be queried.
     */
    async query(key: string, items: (string | number)[]): Promise<TOPKResponse[]> {
        return await this.redis.send_command('TOPK.QUERY', [key].concat(items as string[]))
    }

    /**
     * Returning count for an item.
     * @param key Name of sketch where item is counted.
     * @param items Item/s to be counted.
     */
    async count(key: string, items: (string | number)[]): Promise<number[]> {
        return await this.redis.send_command('TOPK.COUNT', [key].concat(items as string[]));
    }

    /**
     * Returning full list of items in Top K list.
     * @param key Name of sketch where item is counted. 
     */
    async list(key: string): Promise<(string | number)[]> {
        return await this.redis.send_command('TOPK.LIST', [key]);
    }
    
    /**
     * Returning information about a key 
     * @param key Name of sketch.
     */
    async info(key: string): Promise<(string | number)[]> {
        return await this.redis.send_command('TOPK.INFO', [key]);
    }
}

/**
 * The response of the TOPK commands
 * @param 1 Stands for 'true'
 * @param 0 Stands for 'false'
 */
export type TOPKResponse = '1' | '0';

/**
 * The sets of the incrby items (and increments)
 * @param item The item name which counter to be increased.
 * @param increment The counter to be increased by this integer.
 */
export type TOPKIncrbyItems = {
    name: string | number,
    increment: number
}