import { CommandData } from "../module.base";
import { TSAddOptions, TSCreateOptions, TSCreateRule, TSIncrbyDecrbyOptions, TSKeySet, TSLabel, TSMRangeOptions, TSRangeOptions } from "./rts.types";

export class RedisTimeSeriesCommander {

    /**
     * Creating a new TS key
     * @param key The key
     * @param options The 'TS.CREATE' optional parameter
     * @param options.retention The 'RETENTION' optional parameter
     * @param options.uncompressed The 'UNCOMPRESSED' optional parameter
     * @param options.chunkSize The 'CHUNK_SIZE' optional parameter
     * @param options.labels A list of 'LABELS' optional parameter
     * @param options.duplicatePolicy The 'DUPLICATE_POLICY' optional parameter
     * @returns "OK"
     */
    create(key: string, options?: TSCreateOptions): CommandData {
        let args = [key];
        if(options !== undefined && options.retention !== undefined)
            args = args.concat(['RETENTION', options.retention.toString()]);
        if(options !== undefined && options.uncompressed === true)
            args.push('UNCOMPRESSED')
        if(options !== undefined && options.chunkSize !== undefined)
            args = args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options !== undefined && options.duplicatePolicy !== undefined)
            args = args.concat(['DUPLICATE_POLICY', options.duplicatePolicy])
        if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS');
            for(const label of options.labels) {
                args = args.concat([label.name, label.value])
            }
        }
        return { 
            command: 'TS.CREATE',
            args: args
        }
    }

    /**
     * Altering an existing TS key
     * @param key Required. The key
     * @param retention Optional. The retention time
     * @param labels Optional. The labels to update
     * 
     */
    alter(key: string, retention?: number, labels?: TSLabel[]): CommandData {
        let args = [key];
        if(retention !== undefined)
            args = args.concat(['RETENTION', retention.toString()]);
        if(labels !== undefined && labels.length > 0) {
            args.push('LABELS')
            for(const label of labels) {
                args = args.concat([label.name, label.value]);
            }
        }
        return {
            command: 'TS.ALTER',
            args: args
        }
    }

    /**
     * Appending/creating a new sample to series
     * @param key The key
     * @param timestamp The timestamp
     * @param value The value
     * @param options The 'TS.ADD' command optional parameters
     * @param options.onDuplicate The 'ON_DUPLICATE' optional parameter
     * @param options.retention The 'RETENTION' optional parameter
     * @param options.uncompressed The 'UNCOMPRESSED' optional parameter
     * @param options.chunkSize The 'CHUNK_SIZE' optional parameter
     * @param options.labels A list of 'LABELS' optional parameter
     */
    add(key: string, timestamp: string, value: string, options?: TSAddOptions): CommandData {
        let args = [key, timestamp, value];
        if(options?.retention !== undefined) {
            args = args.concat(['RETENTION', `${options.retention}`])
        }
        if(options?.uncompressed === true){
            args.push('UNCOMPRESSED');
        }
        if(options?.onDuplicate){
            args = args.concat(['ON_DUPLICATE', options.onDuplicate]);
        }
        if(options?.chunkSize !== undefined){
            args = args.concat(['CHUNK_SIZE', `${options.chunkSize}`])
        }
        if(options?.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args = args.concat([label.name, label.value]);
            }
        }
        return {
            command: 'TS.ADD',
            args: args
        }
    }

    /**
     * Appending new samples to a list of series
     * @param keySets A list of key sets
     * @param keySets.key The key
     * @param keySets.timestamp The timestamp
     * @param keySets.value The value
     */
    madd(keySets: TSKeySet[]): CommandData {
        let args: string[] = []
        for(const keySet of keySets){
            args = args.concat([keySet.key, keySet.timestamp, keySet.value]);
        }
        return {
            command: 'TS.MADD',
            args: args
        }
    }

    /**
     * Creating a new sample that increments the latest sample's value
     * @param key The key
     * @param value The value
     * @param options The 'TS.INCRBY' command optional parameters
     * @param options.timestamp The 'TIMESTAMP' optional parameter
     * @param options.retention The 'RETENTION' optional parameter
     * @param options.uncompressed The 'UNCOMPRESSED' optional parameter
     * @param options.chunkSize The 'CHUNK_SIZE' optional parameter
     * @param options.labels A list of 'LABELS' optional parameter
     */
    incrby(key: string, value: string, options?: TSIncrbyDecrbyOptions): CommandData {
        let args = [key, value];
        if(options !== undefined && options.retention !== undefined)
            args = args.concat(['RETENTION', options.retention.toString()])
        if(options !== undefined && options.uncompressed === true)
            args.push('UNCOMPRESSED');
        if(options !== undefined && options.chunkSize !== undefined)
            args = args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args = args.concat([label.name, label.value]);
            }
        }
        return {
            command: 'TS.INCRBY',
            args: args
        }
    }

    /**
     * Creating a new sample that decrements the latest sample's value
     * @param key The key
     * @param value The value
     * @param options The 'TS.DECRBY' command optional parameters
     * @param options.timestamp The 'TIMESTAMP' optional parameter
     * @param options.retention The 'RETENTION' optional parameter
     * @param options.uncompressed The 'UNCOMPRESSED' optional parameter
     * @param options.chunkSize The 'CHUNK_SIZE' optional parameter
     * @param options.labels A list of 'LABELS' optional parameter
     */
    decrby(key: string, value: string, options?: TSIncrbyDecrbyOptions): CommandData {
        let args = [key, value];
        if(options !== undefined && options.retention !== undefined)
            args = args.concat(['RETENTION', options.retention.toString()])
        if(options !== undefined && options.uncompressed === true)
            args.push('UNCOMPRESSED');
        if(options !== undefined && options.chunkSize !== undefined)
            args = args.concat(['CHUNK_SIZE', options.chunkSize.toString()])
        if(options !== undefined && options.labels !== undefined && options.labels.length > 0) {
            args.push('LABELS')
            for(const label of options.labels) {
                args = args.concat([label.name, label.value]);
            }
        }
        return {
            command: 'TS.DECRBY',
            args: args
        }
    }
    
    /**
     * Creating a compaction rule
     * @param parameters The 'TS.CREATERULE' command optional parameters
     * @param options.sourceKey The source key
     * @param options.destKey The dest key
     * @param options.aggregation The aggregation type
     * @param options.timeBucket The time bucket
     */
    createrule(parameters: TSCreateRule): CommandData {
        const args = [parameters.sourceKey, parameters.destKey, 'AGGREGATION', parameters.aggregation, parameters.timeBucket.toString()]
        return {
            command: 'TS.CREATERULE',
            args: args
        }
    }

    /**
     * Deleting a compaction rule
     * @param sourceKey The source key
     * @param destKey The dest key
     */
    deleterule(sourceKey: string, destKey: string): CommandData {
        return {
            command: 'TS.DELETERULE',
            args: [sourceKey, destKey]
        }
    }

    /**
     * Querying a range in forward directions
     * @param key The key
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param options The 'TS.Range' command optional parameters
     * @param options.count The 'COUNT' optional parameter
     * @param options.aggregation The 'AGGREGATION' optional parameter
     * @param options.aggregation.type The type of the 'AGGREGATION' command
     * @param options.aggregation.timeBucket The time bucket of the 'AGGREGATION' command
     */
    range(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions): CommandData {
        const args = this.buildRangeCommand(key, fromTimestamp, toTimestamp, options);
        return {
            command: 'TS.RANGE',
            args: args
        }
    }
    
    /**
     * Querying a range in reverse directions
     * @param key The key
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param options The 'TS.Range' command optional parameters
     * @param options.count The 'COUNT' optional parameter
     * @param options.aggregation The 'AGGREGATION' optional parameter
     * @param options.aggregation.type The type of the 'AGGREGATION' command
     * @param options.aggregation.timeBucket The time bucket of the 'AGGREGATION' command
     */
    revrange(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions): CommandData {
        const args = this.buildRangeCommand(key, fromTimestamp, toTimestamp, options);
        return {
            command: 'TS.REVRANGE',
            args: args
        }
    }

    /**
     * Building the arguments for 'TS.RANGE'/'TS.REVRANGE' commands
     * @param key The key
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param options The 'TS.RANGE'/'TS.REVRANGE' command optional parameters
     * @returns The arguments of the command
     */
    private buildRangeCommand(key: string, fromTimestamp: string, toTimestamp: string, options?: TSRangeOptions): string[] {
        let args = [key, fromTimestamp, toTimestamp];
        if(options?.filterByTS !== undefined) {
            args = args.concat(['FILTER_BY_TS', options.filterByTS.join(' ')]);
        }
        if(options?.filterByValue !== undefined) {
            args = args.concat(['FILTER_BY_VALUE', `${options.filterByValue.min}`, `${options.filterByValue.max}`]);
        }
        if(options?.count !== undefined){
            args = args.concat(['COUNT', `${options.count}`]);
        }
        if(options?.align !== undefined){
            args = args.concat(['ALIGN', `${options.align}`]);
        }
        if(options?.aggregation !== undefined){
            args = args.concat(['AGGREGATION', options.aggregation.type, `${options.aggregation.timeBucket}`]);
        }
        return args;
    }

    /**
     * Querying a range across multiple time-series by filters in forward directions
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param filter The filter
     * @param options The 'TS.MRange' command optional parameters
     * @param options.count The 'COUNT' optional parameter
     * @param options.aggregation The 'AGGREGATION' optional parameter
     * @param options.aggregation.type The type of the 'AGGREGATION' command
     * @param options.aggregation.timeBucket The time bucket of the 'AGGREGATION' command
     * @param options.withLabels The 'WITHLABELS' optional parameter
     */
    mrange(fromTimestamp: string, toTimestamp: string, filter: string, options?: TSMRangeOptions): CommandData {
        const args = this.buildMultiRangeCommand(fromTimestamp, toTimestamp, filter, options);
        return {
            command: 'TS.MRANGE',
            args: args
        }
    }
    
    /**
     * Querying a range across multiple time-series by filters in reverse directions
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param filter The filter
     * @param options The 'TS.MRange' command optional parameters
     * @param options.count The 'COUNT' optional parameter
     * @param options.aggregation The 'AGGREGATION' optional parameter
     * @param options.aggregation.type The type of the 'AGGREGATION' command
     * @param options.aggregation.timeBucket The time bucket of the 'AGGREGATION' command
     * @param options.withLabels The 'WITHLABELS' optional parameter
     */
    mrevrange(fromTimestamp: string, toTimestamp: string, filter: string, options?: TSMRangeOptions): CommandData {
        const args = this.buildMultiRangeCommand(fromTimestamp, toTimestamp, filter, options);
        return {
            command: 'TS.MREVRANGE',
            args: args
        }
    }

    /**
     * Building the arguments for 'TS.MRANGE'/'TS.MREVRANGE' commands
     * @param fromTimestamp The starting timestamp
     * @param toTimestamp The ending timestamp
     * @param filter The filter
     * @param options The 'TS.MRANGE'/'TS.MREVRANGE' command optional parameters 
     * @returns The arguments of the command
     */
    private buildMultiRangeCommand(fromTimestamp: string, toTimestamp: string, filter: string, options?: TSMRangeOptions): string[] {
        let args = [fromTimestamp, toTimestamp];
        if(options?.count !== undefined) {
            args = args.concat(['COUNT', `${options.count}`]);
        }
        if(options?.align !== undefined){
            args = args.concat(['ALIGN', `${options.align}`]);
        }
        if(options?.aggregation){
            args = args.concat(['AGGREGATION', `${options.aggregation.type}`, `${options.aggregation.timeBucket}`]);
        }
        if(options?.withLabels === true) {
            args.push('WITHLABELS')
        }
        args = args.concat(['FILTER', `${filter}`])
        if(options?.groupBy){
            args = args.concat(['GROUPBY', `${options.groupBy.label}`, 'REDUCE', `${options.groupBy.reducer}`])
        }
        return args;
    }
    
    /**
     * Retrieving the last sample of a key
     * @param key The key
     */
    get(key: string): CommandData {
        return {
            command: 'TS.GET',
            args: [key]
        }
    }

    /**
     * Retrieving the last sample of a key by filter
     * @param filter Required. The filter
     * @param withLabels Optional. If to add the 'WITHLABELS' Optional parameter
     */
    mget(filter: string, withLabels?: boolean): CommandData {
        let args: string[] = [];
        if(withLabels === true){
            args.push('WITHLABELS');
        }
        args = args.concat(['FILTER'], filter.split(' '))
        return {
            command: 'TS.MGET',
            args: args
        }
    }

    /**
     * Retrieving information and statistics on the time-series
     * @param key The key
     */
    info(key: string): CommandData {
        return {
            command: 'TS.INFO',
            args: [key]
        }
    }

    /**
     * Retrieving all the keys matching the filter list
     * @param filter The filter
     */
    queryindex(filter: string): CommandData {
        return {
            command: 'TS.QUERYINDEX',
            args: [filter]
        }
    }

    /**
     * Delete data points for a given timeseries and interval range in the form of start and end delete timestamps.
     * @param key Key name for timeseries
     * @param fromTimestamp Start timestamp for the range deletion.
     * @param toTimestamp End timestamp for the range deletion.
     * @returns The count of samples deleted
     */
    del(key: string, fromTimestamp: string, toTimestamp: string): CommandData {
        return {
            command: 'TS.DEL',
            args: [key, fromTimestamp, toTimestamp]
        }
    }
}