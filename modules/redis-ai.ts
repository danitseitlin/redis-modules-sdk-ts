import { Module } from './module.base'
import * as Redis from 'ioredis';

export class RedisAI extends Module {

    /**
     * Initializing the RedisAI object
     * @param options The options of the Redis database.
     */
    constructor(options: Redis.RedisOptions) {
        super(options)
    }
}