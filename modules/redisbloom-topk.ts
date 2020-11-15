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
     * Adding an item to the data structure. 
     * @param key Name of sketch where item is added.
     * @param items Item/s to be added.
     */
    async add(key: string, items: string[]): Promise<string[]> {
        return await this.redis.send_command('TPK.ADD', [key].concat(items))
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    async incrby(key: string, items: TOPKIncrbyItems[]): Promise<string[]> {
        const args = [key];
        for(const item of items)
            args.concat([item.item, item.increment.toString()])
        return await this.redis.send_command('TOPK.INCRBY', args);
    }
    
    /**
     * Checking whether an item is one of Top-K items.
     * @param key Name of sketch where item is queried.
     * @param items Item/s to be queried.
     */
    async query(key: string, items: string[]): Promise<TOPKResponse[]> {
        return await this.redis.send_command('TOPK.QUERY', [key].concat(items))
    }

    /**
     * Returning count for an item.
     * @param key Name of sketch where item is counted.
     * @param items Item/s to be counted.
     */
    async count(key: string, items: string[]): Promise<number[]> {
        return await this.redis.send_command('TOPK.COUNT', [key].concat(items));
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
type TOPKResponse = '1' | '0';

/**
 * The sets of the incrby items (and increments)
 * @param item The item which counter to be increased.
 * @param increment The counter to be increased by this integer.
 */
export type TOPKIncrbyItems = {
    item: string,
    increment: number
}