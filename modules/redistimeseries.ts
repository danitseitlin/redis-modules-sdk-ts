
import * as Redis from 'ioredis';

export class RedisTimeSeries {

    public redis: Redis.Redis;

    /**
     * Initializing the ReJSON object. Initialization starts an active connection to the Redis database
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

    async create(key: string, options: TSCreateOptions) {
        const args = [key];
        if(options.retention !== undefined)
            args.concat(['RETENTION', options.retention.toString()]);
        if(options.uncompressed === true)
            args.push('UNCOMPRESSED')
        if(options.chunkSize !== undefined)
            args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options.duplicatePolicy !== undefined)
            args.concat(['DUPLICATE_POLICY', options.duplicatePolicy])
        if(options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS');
            for(const label of options.labels) {
                args.concat([label.name, label.value])
            }
        }
        return await this.redis.send_command('TS.CREATE', args)
    }

    async del() {

    }

    async alter(key: string, options) {
        
    }

    async add(key: string, timestamp: string, value: string, options) {

    }

    async madd() {

    }

    async incrby() {

    }

    async decrby() {

    }
    async createRule() {

    }

    async deleteRule() {

    }
    async range() {

    }
    async revrange() {

    }
    async mrange() {

    }
    
    async mrevrange() {

    }

    async get() {

    }

    async mget() {

    }

    async info() {

    }
}

export type TSCreateOptions = {
    retention?: number,
    uncompressed?: boolean,
    chunkSize?: number,
    duplicatePolicy?: string,
    labels?: {
        name: string,
        value: string
    }[]
}