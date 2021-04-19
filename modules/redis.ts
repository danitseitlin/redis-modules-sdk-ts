
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
	
	/**
	 * Initializing the 'All In One' Redis object
	 * @param options The options of the Redis database.
	 * @param moduleOptions The additional module options
	 * @param moduleOptions.isHandleError If to throw error on error
	 * @param moduleOptions.showDebugLogs If to print debug logs
	 */
	constructor(options: IORedis.RedisOptions, public moduleOptions?: RedisModuleOptions) {
		super('Redis', options, moduleOptions)
		this.applyMixins(Redis, [
			RedisAI, RedisIntervalSets, RedisBloom, RedisBloomCMK, RedisBloomCuckoo, RedisBloomTopK, Redisearch, RedisGears, RedisGraph, ReJSON, RedisTimeSeries
		])
	}

	/**
	 * Applying mixings of given objects into base object
	 * @param baseObject The base objects
	 * @param givenObjects An array of given objects
	 * @param addPrefix If to add a prefix of Object name to the properties as ObjectName_FunctionName
	 */
	private applyMixins(baseObject: any, givenObjects: any[], addPrefix = true): void {
		givenObjects.forEach(givenObject => {
			Object.getOwnPropertyNames(givenObject.prototype).forEach((name: string) => {
				const functionName = addPrefix ? `${modulePropNames[givenObject.name]}_${name}`: name;
				Object.defineProperty(baseObject.prototype, functionName, Object.getOwnPropertyDescriptor(givenObject.prototype, name));
			});
		});
	}
}

export const modulePropNames = {
	RedisAI: 'ai_module',
	RedisIntervalSets: 'ris_module',
	RedisBloom: 'bloom_module',
	RedisBloomCMK: 'bloom_cmk_module',
	RedisBloomCuckoo: 'bloom_cuckoo_module',
	RedisBloomTopK: 'bloom_topk_module',
	Redisearch: 'search_module',
	RedisGears: 'gears_module',
	RedisGraph: 'graph_module',
	ReJSON: 'rejson_module',
	RedisTimeSeries: 'rts_module',
}

export type Mixin<T extends any, Y extends string> = { [P in keyof T & string as `${Y}_${P}`]: T[P] };
export interface Redis extends Mixin<RedisAI, 'ai_module'>, Mixin<RedisIntervalSets, 'ris_module'>, Mixin<RedisBloom, 'bloom_module'>, Mixin<RedisBloomCMK, 'bloom_cmk_module'>, Mixin<RedisBloomCuckoo, 'bloom_cuckoo_module'>, Mixin<RedisBloomTopK, 'bloom_topk_module'>, Mixin<Redisearch, 'search_module'>, Mixin<RedisGears, 'gears_module'>, Mixin<RedisGraph, 'graph_module'>, Mixin<ReJSON, 'rejson_module'>, Mixin<RedisTimeSeries, 'rts_module'> {}