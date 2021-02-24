
import * as IORedis from 'ioredis';
import { Module } from './module.base';
import { RedisAI } from './redis-ai';
import { RedisBloom } from './redisbloom';
import { RedisBloomCMK } from './redisbloom-cmk';
import { RedisBloomCuckoo } from './redisbloom-cuckoo';
import { RedisBloomTopK } from './redisbloom-topk';
import { Redisearch } from './redisearch';
import { RedisGears } from './redisgears';
import { RedisGraph } from './redisgraph';
import { ReJSON } from './rejson';
import { RedisTimeSeries } from './rts';

export class Redis extends Module {
    public rts: RedisTimeSeries
    public rejson: ReJSON
    public graph: RedisGraph
    public gears: RedisGears
    public search: Redisearch
    public bloom: RedisBloom
    public bloomTopK: RedisBloomTopK
    public bloomCuckoo: RedisBloomCuckoo
    public bloomCMK: RedisBloomCMK
    public ai: RedisAI
    
    /**
     * Initializing the Redis object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: IORedis.RedisOptions, throwError = true) {
        super('Redis', options, throwError)
        this.rts = new RedisTimeSeries(options)
        this.rejson = new ReJSON(options)
        this.graph = new RedisGraph(options)
        this.gears = new RedisGears(options)
        this.search = new Redisearch(options)
        this.bloom = new RedisBloom(options)
        this.bloomTopK = new RedisBloomTopK(options)
        this.bloomCuckoo = new RedisBloomCuckoo(options)
        this.bloomCMK = new RedisBloomCMK(options)
        this.ai = new RedisAI(options)
    }

    /**
     * Connecting to the Redis database with the module
     */
    async connect() {
        await this.connect();
        await this.rts.connect();
        await this.rejson.connect();
        await this.graph.connect();
        await this.gears.connect();
        await this.search.connect();
        await this.bloom.connect();
        await this.bloomTopK.connect();
        await this.bloomCuckoo.connect();
        await this.bloomCMK.connect();
        await this.ai.connect();
    }

    /**
     * Disconnecting from the Redis database with the module
     */
    async disconnect() {
        await this.disconnect();
        await this.rts.disconnect();
        await this.rejson.disconnect();
        await this.graph.disconnect();
        await this.gears.disconnect();
        await this.search.disconnect();
        await this.bloom.disconnect();
        await this.bloomTopK.disconnect();
        await this.bloomCuckoo.disconnect();
        await this.bloomCMK.disconnect();
        await this.ai.disconnect();
    }
}