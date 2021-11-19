
import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from '../module.base';
import { SearchCommander } from './redisearch.commander';
import {
    FTAggregateParameters, FTConfig, FTCreateParameters, FTFieldOptions, FTFieldType, FTIndexType, FTInfo, FTSchemaField,
    FTSearchParameters, FTSearchResponse, FTSpellCheck, FTSpellCheckResponse, FTSugAddParameters, FTSugGetParameters, FTAggregateResponse
} from './redisearch.types';
import { RedisearchHelpers } from './redisearch.helpers';

export class Redisearch extends Module {

    private searchCommander = new SearchCommander();
    private searchHelpers = new RedisearchHelpers();

    /**
     * Initializing the module object
     * @param name The name of the module
     * @param clusterNodes The nodes of the cluster
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     * @param clusterOptions The options of the clusters
     */
    constructor(clusterNodes: Redis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: Redis.ClusterOptions)
    /**
     * Initializing the module object
     * @param name The name of the module
     * @param redisOptions The options of the redis database
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     */
    constructor(redisOptions: Redis.RedisOptions, moduleOptions?: RedisModuleOptions)
    constructor(options: Redis.RedisOptions & Redis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: Redis.ClusterOptions) {
        super(Redisearch.name, options, moduleOptions, clusterOptions)
    }

    /**
     * Creating an index with a given spec
     * @param index The index of the schema
     * @param indexType The index type of the schema
     * @param schemaFields The filter set after the 'SCHEMA' argument
     * @param parameters The additional parameters of the spec
     * @returns 'OK' or error
     */
    async create(index: string, indexType: FTIndexType, schemaFields: FTSchemaField[], parameters?: FTCreateParameters): Promise<'OK' | string> {
        const command = this.searchCommander.create(index, indexType, schemaFields, parameters);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Searching the index with a textual query
     * @param index The index
     * @param query The query
     * @param parameters The additional optional parameter
     * @returns Array reply, where the first element is the total number of results, and then pairs of document id, and a nested array of field/value.
     */
    async search(index: string, query: string, parameters?: FTSearchParameters): Promise<FTSearchResponse> {
        const command = this.searchCommander.search(index, query, parameters);
        const response = await this.sendCommand(command);
        const parseResponse = parameters?.parseSearchQueries ?? true;
        return this.handleResponse(response, parseResponse);
    }

    /**
     * Runs a search query on an index, and performs aggregate transformations on the results, extracting statistics etc from them
     * @param index The index
     * @param query The query
     * @param parameters The additional optional parameters
     * @returns Array Response. Each row is an array and represents a single aggregate result
     */
    async aggregate(index: string, query: string, parameters?: FTAggregateParameters): Promise<FTAggregateResponse> {
        const command = this.searchCommander.aggregate(index, query, parameters);
        const response = await this.sendCommand(command);
        return this.searchHelpers.handleAggregateResponse(response);
    }

    /**
     * Retrieving the execution plan for a complex query
     * @param index The index
     * @param query The query
     * @returns Returns the execution plan for a complex query
     */
    async explain(index: string, query: string): Promise<string> {
        const command = this.searchCommander.explain(index, query);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Retrieving the execution plan for a complex query but formatted for easier reading without using redis-cli --raw 
     * @param index The index
     * @param query The query
     * @returns A string representing the execution plan.
     */
    async explainCLI(index: string, query: string): Promise<string[]> {
        const command = this.searchCommander.explainCLI(index, query);
        const response = await this.sendCommand(command);
        return this.handleResponse(response.join(''));
    }

    /**
     * Adding a new field to the index
     * @param index The index
     * @param field The field name
     * @param fieldType The field type
     * @param options The additional optional parameters
     * @returns 'OK' or error
     */
    async alter(index: string, field: string, fieldType: FTFieldType, options?: FTFieldOptions): Promise<'OK' | string> {
        const command = this.searchCommander.alter(index, field, fieldType, options);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Deleting the index
     * @param index The index
     * @param deleteHash If set, the drop operation will delete the actual document hashes.
     * @returns 'OK' or error
     */
    async dropindex(index: string, deleteHash = false): Promise<'OK' | string> {
        const command = this.searchCommander.dropindex(index, deleteHash);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Adding alias fron an index
     * @param name The alias name
     * @param index The alias index
     * @returns 'OK' or error
     */
    async aliasadd(name: string, index: string): Promise<'OK' | string> {
        const command = this.searchCommander.aliasadd(name, index);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Updating alias index
     * @param name The alias name
     * @param index The alias index
     * @returns 'OK' or error
     */
    async aliasupdate(name: string, index: string): Promise<'OK' | string> {
        const command = this.searchCommander.aliasupdate(name, index);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Deleting alias fron an index
     * @param name The alias name
     * @returns 'OK' or error
     */
    async aliasdel(name: string): Promise<'OK' | string> {
        const command = this.searchCommander.aliasdel(name);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Retrieving the distinct tags indexed in a Tag field
     * @param index The index
     * @param field The field name
     * @returns The distinct tags indexed in a Tag field 
     */
    async tagvals(index: string, field: string): Promise<string[]> {
        const command = this.searchCommander.tagvals(index, field);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Adds a suggestion string to an auto-complete suggestion dictionary
     * @param key The key
     * @param suggestion The suggestion
     * @param score The score
     * @param options The additional optional parameters
     * @returns The current size of the suggestion dictionary
     */
    async sugadd(key: string, suggestion: string, score: number, options?: FTSugAddParameters): Promise<number> {
        const command = this.searchCommander.sugadd(key, suggestion, score, options);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Retrieving completion suggestions for a prefix
     * @param key The key
     * @param prefix The prefix of the suggestion
     * @param options The additional optional parameter
     * @returns A list of the top suggestions matching the prefix, optionally with score after each entry 
     */
    async sugget(key: string, prefix: string, options?: FTSugGetParameters): Promise<string> {
        const command = this.searchCommander.sugget(key, prefix, options);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Deleting a string from a suggestion index
     * @param key The key
     * @param suggestion The suggestion
     */
    async sugdel(key: string, suggestion: string): Promise<number> {
        const command = this.searchCommander.sugdel(key, suggestion);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Retrieving the size of an auto-complete suggestion dictionary
     * @param key The key
     */
    async suglen(key: string): Promise<number> {
        const command = this.searchCommander.suglen(key);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Updating a synonym group
     * @param index The index
     * @param groupId The group id
     * @param terms A list of terms 
     * @param skipInitialScan If set, we do not scan and index.
     * @returns 'OK'
     */
    async synupdate(index: string, groupId: number, terms: string[], skipInitialScan = false): Promise<'OK'> {
        const command = this.searchCommander.synupdate(index, groupId, terms, skipInitialScan);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Dumps the contents of a synonym group
     * @param index The index
     * @returns A list of synonym terms and their synonym group ids.  
     */
    async syndump(index: string): Promise<{[key: string]: string | number}> {
        const command = this.searchCommander.syndump(index);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Performs spelling correction on a query
     * @param index The index
     * @param query The query
     * @param options The additional optional parameters
     * @returns An array, in which each element represents a misspelled term from the query
     */
    async spellcheck(index: string, query: string, options?: FTSpellCheck): Promise<FTSpellCheckResponse[]> {
        const command = this.searchCommander.spellcheck(index, query, options);
        const response = await this.sendCommand(command);
        return this.searchHelpers.handleSpellcheckResponse(response);
    }

    /**
     * Adding terms to a dictionary
     * @param dict The dictionary
     * @param terms A list of terms
     * @returns The number of new terms that were added
     */
    async dictadd(dict: string, terms: string[]): Promise<number> {
        const command = this.searchCommander.dictadd(dict, terms);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Deleting terms from a dictionary
     * @param dict The dictionary
     * @param terms A list of terms
     * @returns The number of terms that were deleted
     */
    async dictdel(dict: string, terms: string[]): Promise<number> {
        const command = this.searchCommander.dictdel(dict, terms);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Dumps all terms in the given dictionary
     * @param dict The dictionary
     * @returns An array, where each element is term
     */
    async dictdump(dict: string): Promise<string> {
        const command = this.searchCommander.dictdump(dict);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Retrieving infromation and statistics on the index
     * @param index The index
     * @returns A nested array of keys and values. 
     */
    async info(index: string): Promise<FTInfo> {
        const command = this.searchCommander.info(index);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Retrieves, describes and sets runtime configuration options
     * @param commandType The command type
     * @param option The option
     * @param value In case of 'SET' command, a valid value to set
     * @returns If 'SET' command, returns 'OK' for valid runtime-settable option names and values. If 'GET' command, returns a string with the current option's value.
     */
    async config(commandType: 'GET' | 'SET' | 'HELP', option: string, value?: string): Promise<FTConfig> {
        const command = this.searchCommander.config(commandType, option, value);
        const response = await this.sendCommand(command);
        return this.handleResponse(response);
    }
}