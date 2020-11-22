import * as Redis from 'ioredis';

export class RedisBloomCMK {

    public redis: Redis.Redis;

    /**
     * Initializing the RedisBloom Count-Min Sketch object
     * @param options The options of the Redis database.
     */
    constructor(public options: Redis.RedisOptions) {}

    /**
     * Connecting to the Redis database with RedisBloom Count-Min Sketch module
     */
    async connect(): Promise<void> {
        this.redis = new Redis(this.options);
    }

    /**
     * Disconnecting from the Redis database with RedisBloom Count-Min Sketch module
     */
    async disconnect(): Promise<void> {
        await this.redis.quit();
    }

    /**
     * Initializes a Count-Min Sketch to dimensions specified by user.
     * @param key The name of the sketch.
     * @param width The number of counter in each array. Reduces the error size.
     * @param depth The number of counter-arrays. Reduces the probability for an error of a certain size (percentage of total count).
     */
    async initbydim(key: string, width: number, depth: number): Promise<'OK'> {
        return await this.redis.send_command('CMS.INITBYDIM', [key, width, depth]);
    }

    /**
     * Initializes a Count-Min Sketch to accommodate requested capacity.
     * @param key The name of the sketch.
     * @param errorSize Estimate size of error. The error is a percent of total counted items. This effects the width of the sketch.
     * @param probability The desired probability for inflated count.
     */
    async initbyprob(key: string, errorSize: number, probability: number): Promise<'OK'> {
        return await this.redis.send_command('CMS.INITBYPROB', [key, errorSize, probability]);
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    async incrby(key: string, items: CMSIncrbyItems[]) {
        const args = [key];
        for(const item of items)
            args.concat([item.name.toString(), item.increment.toString()])
        return await this.redis.send_command('CMS.INCRBY', args);
    }

    /**
     * Returns count for item's.
     * @param key The name of the sketch.
     * @param items A list of items.
     */
    async query(key: string, items: string[]) {
        return await this.redis.send_command('CMS.QUERY', [key].concat(items));
    }

    /**
     * Merges several sketches into one sketch.
     * @param dest The name of destination sketch.
     * @param numKeys The number of sketches to be merged.
     * @param sources The names of source sketches to be merged. 
     * @param weights A multiple of each sketch. Default =1.
     */
    async merge(dest: string, numKeys: number, sources: string[], weights?: number[]) {
        const args = [dest, numKeys];
        args.concat(sources);
        if(weights !== undefined && weights.length > 0) {
            args.push('WEIGHTS');
            for(const weight of weights)
                args.push(weight.toString());
        }
        return await this.redis.send_command('CMS.MERGE', args);
    }

    /**
     * Returning information about a key 
     * @param key The key of the 'CMS.INFO' command
     */
    async info(key: string): Promise<string[]> {
        return await this.redis.send_command('CMS.INFO', [key]);
    }
}

/**
 * The sets of the incrby items (and increments)
 * @param name The item name which counter to be increased.
 * @param increment The counter to be increased by this integer.
 */
export type CMSIncrbyItems = {
    name: string,
    increment: number
}