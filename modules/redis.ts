
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as IORedis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';
import { RedisAI } from './redis-ai';
import { RedisBloom } from './redisbloom';
import { RedisBloomCMK } from './redisbloom-cmk';
import { RedisBloomCuckoo } from './redisbloom-cuckoo';
import { RedisBloomTopK } from './redisbloom-topk';
import { Redisearch } from './redisearch';
import { RedisGears } from './redisgears';
import { RedisGraph } from './redisgraph';
import { ReJSON } from './rejson';
import { RedisIntervalSets } from './ris';
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
	public ris: RedisIntervalSets
	
	/**
	 * Initializing the Redis object
	 * @param options The options of the Redis database.
	 * @param moduleOptions The additional module options
	 * @param moduleOptions.isHandleError If to throw error on error
	 * @param moduleOptions.showDebugLogs If to print debug logs
	 */
	constructor(options: IORedis.RedisOptions, public moduleOptions?: RedisModuleOptions) {
		super('Redis', options, moduleOptions)
		this.applyMixins(Redis, [RedisAI/*, RedisIntervalSets, RedisBloom, RedisBloomCMK, RedisBloomCuckoo, RedisBloomTopK, Redisearch, RedisGears, RedisGraph, ReJSON, RedisTimeSeries*/])
	}

	/**
	 * Connecting to the Redis database with the module
	 */
	async connectAll() {
		await this.connect();
	}

	/**
	 * Disconnecting from the Redis database with the module
	 */
	async disconnectAll() {
		await this.disconnect();
	}
	private applyMixins(baseObject: any, baseCtors: any[], addPrefix = true) {
		baseCtors.forEach(baseCtor => {
			Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
				const functionName = addPrefix ? `${baseCtor.prototype.name}_${name}`: name;
				Object.defineProperty(baseObject.prototype, functionName, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
			});
		});
	}
}

export interface Redis extends Mixin<RedisAI, 'RedisAI'> {}//, RedisIntervalSets, RedisBloom, RedisBloomCMK, RedisBloomCuckoo, RedisBloomTopK, Redisearch, RedisGears, RedisGraph, ReJSON, RedisTimeSeries {}

//type Mixin<T> = { [P in keyof T & string as `${P}`]: T[P] };
type Mixin<T extends any, Y extends string> = { [P in keyof T & string as `${Y}_${P}`]: T[P] };
