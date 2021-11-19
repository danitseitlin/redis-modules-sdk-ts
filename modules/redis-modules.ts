
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as IORedis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';
import { RedisAI } from './redis-ai/redis-ai';
import { RedisAICommander } from './redis-ai/redis-ai.commander';
import { RedisBloom } from './bloom/redisbloom';
import { RedisBloomCMK } from './bloom-cmk/redisbloom-cmk';
import { RedisBloomCuckoo } from './bloom-cuckoo/redisbloom-cuckoo';
import { RedisBloomTDigest } from './bloom-tdigest/redisbloom-tdigest';
import { RedisBloomTopK } from './bloom-topk/redisbloom-topk';
import { Redisearch } from './redisearch/redisearch';
import { RedisGears } from './redisgears/redisgears';
import { RedisGraph } from './redisgraph/redisgraph';
import { ReJSON } from './rejson/rejson';
import { RedisIntervalSets } from './ris/ris';
import { RedisIntervalSetsCommander } from './ris/ris.commander';
import { RedisTimeSeries } from './rts/rts';
import { BloomTdigestCommander } from './bloom-tdigest/redisbloom-tdigest.commander';
import { BloomCommander } from './bloom/redisbloom.commander';
import { BloomCmkCommander } from './bloom-cmk/redisbloom-cmk.commander';
import { BloomCuckooCommander } from './bloom-cuckoo/redisbloom-cuckoo.commander';
import { BloomTopkCommander } from './bloom-topk/redisbloom-topk.commander';
import { SearchCommander } from './redisearch/redisearch.commander';
import { GearsCommander } from './redisgears/redisgears.commander';
import { GraphCommander } from './redisgraph/redisgraph.commander';
import { RejsonCommander } from './rejson/rejson.commander';
import { RedisTimeSeriesCommander } from './rts/rts.commander';
import { RedisearchHelpers } from './redisearch/redisearch.helpers';
import { RedisIntervalSetsHelpers } from './ris/ris.helpers';

export class RedisModules extends Module {
	public bloomCommander = new BloomCommander()
	public bloomCmkCommander = new BloomCmkCommander()
	public bloomCuckooCommander = new BloomCuckooCommander()
	public bloomTdigestCommander = new BloomTdigestCommander()
	public bloomTopkCommander = new BloomTopkCommander()
	public aiCommander = new RedisAICommander()
	public searchCommander = new SearchCommander()
	public gearsCommander = new GearsCommander()
	public graphCommander = new GraphCommander()
	public rejsonCommander = new RejsonCommander()
	public risCommander = new RedisIntervalSetsCommander()
	public rtsCommander = new RedisTimeSeriesCommander()
	public searchHelpers = new RedisearchHelpers();
	public risHelpers = new RedisIntervalSetsHelpers();

	/**
     * Initializing the module object
     * @param name The name of the module
     * @param clusterNodes The nodes of the cluster
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     * @param clusterOptions The options of the clusters
     */
	constructor(clusterNodes: IORedis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: IORedis.ClusterOptions)
	/**
	 * Initializing the module object
	 * @param name The name of the module
	 * @param redisOptions The options of the redis database
	 * @param moduleOptions The additional module options
	 * @param moduleOptions.isHandleError If to throw error on error
	 * @param moduleOptions.showDebugLogs If to print debug logs
	 */
	constructor(redisOptions: IORedis.RedisOptions, moduleOptions?: RedisModuleOptions)
	constructor(options: IORedis.RedisOptions & IORedis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: IORedis.ClusterOptions) {
		super(RedisModules.name, options, moduleOptions, clusterOptions);
		this.applyMixins(RedisModules, [
			RedisAI, RedisIntervalSets, RedisBloom, RedisBloomCMK, RedisBloomCuckoo, RedisBloomTopK, RedisBloomTDigest, Redisearch, RedisGears, RedisGraph, ReJSON, RedisTimeSeries, RedisIntervalSets
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
				if(name !== 'constructor'){
					const functionName = addPrefix ? `${modulePropNames[givenObject.name]}_${name}`: name;
					Object.defineProperty(baseObject.prototype, functionName, Object.getOwnPropertyDescriptor(givenObject.prototype, name));
				}
			});
		});
	}
}

/**
 * The Redis 'All in One' RedisIntervalSet module functions
 */
export type RedisIntervalSetMixin = {
	ris_module_add: typeof RedisIntervalSets.prototype.add,
	ris_module_get: typeof RedisIntervalSets.prototype.get,
	ris_module_del: typeof RedisIntervalSets.prototype.del,
	ris_module_score: typeof RedisIntervalSets.prototype.score,
	ris_module_notScore: typeof RedisIntervalSets.prototype.notScore
}

/**
 * The Redis 'All in One' RedisAI module functions
 */
export type RedisAIMixin = {
	redisaiCommander: RedisAICommander,
	ai_module_tensorset: typeof RedisAI.prototype.tensorset,
	ai_module_tensorget: typeof RedisAI.prototype.tensorget,
	ai_module_modeldel: typeof RedisAI.prototype.modeldel,
	ai_module_modelstore: typeof RedisAI.prototype.modelstore,
	ai_module_modelget: typeof RedisAI.prototype.modelget,
	ai_module_modelexecute: typeof RedisAI.prototype.modelexecute,
	ai_module_modelscan: typeof RedisAI.prototype.modelscan,
	ai_module_scriptset: typeof RedisAI.prototype.scriptset,
	ai_module_scriptget: typeof RedisAI.prototype.scriptget,
	ai_module_scriptdel: typeof RedisAI.prototype.scriptdel,
	ai_module_scriptexecute: typeof RedisAI.prototype.scriptexecute,
	ai_module_scriptscan: typeof RedisAI.prototype.scriptscan,
	ai_module_dagexecute: typeof RedisAI.prototype.dagexecute,
	ai_module_dagexecuteRO: typeof RedisAI.prototype.dagexecuteRO,
	ai_module_info: typeof RedisAI.prototype.info,
	ai_module_config: typeof RedisAI.prototype.config
}

/**
 * The Redis 'All in One' RedisBloom module functions
 */
export type RedisBloomMixin = {
	bloom_module_reserve: typeof RedisBloom.prototype.reserve,
	bloom_module_add: typeof RedisBloom.prototype.add,
	bloom_module_madd: typeof RedisBloom.prototype.madd,
	bloom_module_insert: typeof RedisBloom.prototype.insert,
	bloom_module_exists: typeof RedisBloom.prototype.exists,
	bloom_module_mexists: typeof RedisBloom.prototype.mexists,
	bloom_module_scandump: typeof RedisBloom.prototype.scandump,
	bloom_module_loadchunk: typeof RedisBloom.prototype.loadchunk,
	bloom_module_info: typeof RedisBloom.prototype.info
}

/**
 * The Redis 'All in One' RedisBloomCMK module functions
 */
export type RedisBloomCMKMixin = {
	bloom_cmk_module_initbydim: typeof RedisBloomCMK.prototype.initbydim,
	bloom_cmk_module_initbyprob: typeof RedisBloomCMK.prototype.initbyprob,
	bloom_cmk_module_incrby: typeof RedisBloomCMK.prototype.incrby,
	bloom_cmk_module_query: typeof RedisBloomCMK.prototype.query,
	bloom_cmk_module_merge: typeof RedisBloomCMK.prototype.merge,
	bloom_cmk_module_info: typeof RedisBloomCMK.prototype.info
}

/**
 * The Redis 'All in One' RedisBloomCuckoo module functions
 */
export type RedisBloomCuckooMixin = {
	bloom_cuckoo_module_reserve: typeof RedisBloomCuckoo.prototype.reserve,
	bloom_cuckoo_module_add: typeof RedisBloomCuckoo.prototype.add,
	bloom_cuckoo_module_addnx: typeof RedisBloomCuckoo.prototype.addnx,
	bloom_cuckoo_module_insert: typeof RedisBloomCuckoo.prototype.insert,
	bloom_cuckoo_module_insertnx: typeof RedisBloomCuckoo.prototype.insertnx,
	bloom_cuckoo_module_exists: typeof RedisBloomCuckoo.prototype.exists,
	bloom_cuckoo_module_del: typeof RedisBloomCuckoo.prototype.del,
	bloom_cuckoo_module_count: typeof RedisBloomCuckoo.prototype.count,
	bloom_cuckoo_module_scandump: typeof RedisBloomCuckoo.prototype.scandump,
	bloom_cuckoo_module_loadchunk: typeof RedisBloomCuckoo.prototype.loadchunk,
	bloom_cuckoo_module_info: typeof RedisBloomCuckoo.prototype.info
}

/**
 * The Redis 'All in One' RedisBloomTopK module functions
 */
export type RedisBloomTopKMixin = {
	bloom_topk_module_reserve: typeof RedisBloomTopK.prototype.reserve,
	bloom_topk_module_add: typeof RedisBloomTopK.prototype.add,
	bloom_topk_module_incrby: typeof RedisBloomTopK.prototype.incrby,
	bloom_topk_module_query: typeof RedisBloomTopK.prototype.query,
	bloom_topk_module_count: typeof RedisBloomTopK.prototype.count,
	bloom_topk_module_list: typeof RedisBloomTopK.prototype.list,
	bloom_topk_module_info: typeof RedisBloomTopK.prototype.info
}

/**
 * The Redis 'All in One' RedisBloomTDigest module functions
 */
 export type RedisBloomTDigestMixin = {
	bloom_tdigest_module_create: typeof RedisBloomTDigest.prototype.create,
	bloom_tdigest_module_reset: typeof RedisBloomTDigest.prototype.reset,
	bloom_tdigest_module_add: typeof RedisBloomTDigest.prototype.add,
	bloom_tdigest_module_merge: typeof RedisBloomTDigest.prototype.merge,
	bloom_tdigest_module_max: typeof RedisBloomTDigest.prototype.max,
	bloom_tdigest_module_min: typeof RedisBloomTDigest.prototype.min,
	bloom_tdigest_module_quantile: typeof RedisBloomTDigest.prototype.quantile
	bloom_tdigest_module_cdf: typeof RedisBloomTDigest.prototype.cdf
	bloom_tdigest_module_info: typeof RedisBloomTDigest.prototype.info
}

/**
 * The Redis 'All in One' Redisearch module functions
 */
export type RedisearchMixin = {
	search_module_create: typeof Redisearch.prototype.create,
	search_module_search: typeof Redisearch.prototype.search,
	search_module_aggregate: typeof Redisearch.prototype.aggregate,
	search_module_explain: typeof Redisearch.prototype.explain,
	search_module_explainCLI: typeof Redisearch.prototype.explainCLI,
	search_module_alter: typeof Redisearch.prototype.alter,
	search_module_dropindex: typeof Redisearch.prototype.dropindex,
	search_module_aliasadd: typeof Redisearch.prototype.aliasadd,
	search_module_aliasupdate: typeof Redisearch.prototype.aliasupdate,
	search_module_aliasdel: typeof Redisearch.prototype.aliasdel,
	search_module_tagvals: typeof Redisearch.prototype.tagvals,
	search_module_sugadd: typeof Redisearch.prototype.sugadd,
	search_module_sugget: typeof Redisearch.prototype.sugget,
	search_module_sugdel: typeof Redisearch.prototype.sugdel,
	search_module_suglen: typeof Redisearch.prototype.suglen,
	search_module_synupdate: typeof Redisearch.prototype.synupdate,
	search_module_syndump: typeof Redisearch.prototype.syndump,
	search_module_spellcheck: typeof Redisearch.prototype.spellcheck,
	search_module_dictadd: typeof Redisearch.prototype.dictadd,
	search_module_dictdel: typeof Redisearch.prototype.dictdel,
	search_module_dictdump: typeof Redisearch.prototype.dictdump,
	search_module_info: typeof Redisearch.prototype.info,
	search_module_config: typeof Redisearch.prototype.config
}

/**
 * The Redis 'All in One' RedisGears module functions
 */
export type RedisGearsMixin = {
	gears_module_abortExecution: typeof RedisGears.prototype.abortExecution,
	gears_module_configGet: typeof RedisGears.prototype.configGet,
	gears_module_configSet: typeof RedisGears.prototype.configSet,
	gears_module_dropExecution: typeof RedisGears.prototype.dropExecution,
	gears_module_dumpExecutions: typeof RedisGears.prototype.dumpExecutions,
	gears_module_dumpRegistrations: typeof RedisGears.prototype.dumpRegistrations,
	gears_module_getExecution: typeof RedisGears.prototype.getExecution,
	gears_module_getResults: typeof RedisGears.prototype.getResults,
	gears_module_getResultsBlocking: typeof RedisGears.prototype.getResultsBlocking,
	gears_module_infocluster: typeof RedisGears.prototype.infocluster,
	gears_module_pyexecute: typeof RedisGears.prototype.pyexecute,
	gears_module_pystats: typeof RedisGears.prototype.pystats,
	gears_module_pydumpreqs: typeof RedisGears.prototype.pydumpreqs,
	gears_module_refreshCluster: typeof RedisGears.prototype.refreshCluster,
	gears_module_trigger: typeof RedisGears.prototype.trigger,
	gears_module_unregister: typeof RedisGears.prototype.unregister
}

/**
 * The Redis 'All in One' RedisGraph module functions
 */
export type RedisGraphMixin = {
	graph_module_query: typeof RedisGraph.prototype.query,
	graph_module_readonlyQuery: typeof RedisGraph.prototype.readonlyQuery,
	graph_module_profile: typeof RedisGraph.prototype.profile,
	graph_module_delete: typeof RedisGraph.prototype.delete,
	graph_module_explain: typeof RedisGraph.prototype.explain,
	graph_module_slowlog: typeof RedisGraph.prototype.slowlog,
	graph_module_config: typeof RedisGraph.prototype.config,
}

/**
 * The Redis 'All in One' ReJSON module functions
 */
export type ReJSONMixin = {
	rejson_module_del: typeof ReJSON.prototype.del,
	rejson_module_set: typeof ReJSON.prototype.set,
	rejson_module_get: typeof ReJSON.prototype.get,
	rejson_module_mget: typeof ReJSON.prototype.mget,
	rejson_module_type: typeof ReJSON.prototype.type,
	rejson_module_numincrby: typeof ReJSON.prototype.numincrby,
	rejson_module_nummultby: typeof ReJSON.prototype.nummultby,
	rejson_module_strappend: typeof ReJSON.prototype.strappend,
	rejson_module_strlen: typeof ReJSON.prototype.strlen,
	rejson_module_arrappend: typeof ReJSON.prototype.arrappend,
	rejson_module_arrindex: typeof ReJSON.prototype.arrindex,
	rejson_module_arrinsert: typeof ReJSON.prototype.arrinsert,
	rejson_module_arrlen: typeof ReJSON.prototype.arrlen,
	rejson_module_arrpop: typeof ReJSON.prototype.arrpop,
	rejson_module_arrtrim: typeof ReJSON.prototype.arrtrim,
	rejson_module_objkeys: typeof ReJSON.prototype.objkeys,
	rejson_module_objlen: typeof ReJSON.prototype.objlen,
	rejson_module_debug: typeof ReJSON.prototype.debug,
	rejson_module_forget: typeof ReJSON.prototype.forget
	rejson_module_resp: typeof ReJSON.prototype.resp,
	rejson_module_clear: typeof ReJSON.prototype.clear,
	rejson_module_toggle: typeof ReJSON.prototype.toggle
}

/**
 * The Redis 'All in One' RedisTimeSeries module functions
 */
export type RedisTimeSeriesMixin = {
	rts_module_create: typeof RedisTimeSeries.prototype.create,
	rts_module_alter: typeof RedisTimeSeries.prototype.alter,
	rts_module_add: typeof RedisTimeSeries.prototype.add,
	rts_module_madd: typeof RedisTimeSeries.prototype.madd,
	rts_module_incrby: typeof RedisTimeSeries.prototype.incrby,
	rts_module_decrby: typeof RedisTimeSeries.prototype.decrby,
	rts_module_createrule: typeof RedisTimeSeries.prototype.createrule,
	rts_module_deleterule: typeof RedisTimeSeries.prototype.deleterule,
	rts_module_range: typeof RedisTimeSeries.prototype.range,
	rts_module_revrange: typeof RedisTimeSeries.prototype.revrange,
	rts_module_mrange: typeof RedisTimeSeries.prototype.mrange,
	rts_module_mrevrange: typeof RedisTimeSeries.prototype.mrevrange,
	rts_module_get: typeof RedisTimeSeries.prototype.get,
	rts_module_mget: typeof RedisTimeSeries.prototype.mget,
	rts_module_info: typeof RedisTimeSeries.prototype.info
	rts_module_queryindex: typeof RedisTimeSeries.prototype.queryindex,
	rts_module_del: typeof RedisTimeSeries.prototype.del
}

/**
 * A list of converted Redis 'All in One' sub function prefixes per module
 */
export const modulePropNames = {
	RedisAI: 'ai_module',
	RedisIntervalSets: 'ris_module',
	RedisBloom: 'bloom_module',
	RedisBloomCMK: 'bloom_cmk_module',
	RedisBloomCuckoo: 'bloom_cuckoo_module',
	RedisBloomTopK: 'bloom_topk_module',
	RedisBloomTDigest: 'bloom_tdigest_module',
	Redisearch: 'search_module',
	RedisGears: 'gears_module',
	RedisGraph: 'graph_module',
	ReJSON: 'rejson_module',
	RedisTimeSeries: 'rts_module',
}

/**
 * A definition of all the modules functions to be under the Redis 'All in One'
 */
export interface RedisModules extends RedisAIMixin, RedisBloomCMKMixin, RedisBloomCuckooMixin, RedisBloomTopKMixin, RedisBloomMixin, RedisBloomTDigestMixin, RedisearchMixin, RedisGearsMixin, RedisGraphMixin, ReJSONMixin, RedisIntervalSetMixin, RedisTimeSeriesMixin {}