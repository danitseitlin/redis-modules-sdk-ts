
import * as Redis from 'ioredis';

export class RediSearch {

    public redis: Redis.Redis;

    /**
     * Initializing the RediSearch object
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

    /**
     * Creating an index with a given spec
     * @param parameters The additional parameters of the spec
     * @param schemaFields The filter set after the 'SCHEMA' argument
     * @returns 'OK'
     */
    async create(index: string, schemaFields: SchemaField[], parameters?: CreateParameters): Promise<'OK'> {
        let args: string[] = [index]
        args = args.concat(['ON', 'HASH']);
        if(parameters !== undefined) {
            if(parameters.prefix !== undefined) {
                args.push('PREFIX');
                for(const prefix of parameters.prefix)
                    args.concat([prefix.count.toString(), prefix.name])
            }
            if(parameters.filter !== undefined)
                args = args.concat(['FILTER', parameters.filter])
            if(parameters.language !== undefined)
                args = args.concat(['LANGUAGE', parameters.language]);
            if(parameters.languageField !== undefined)
                args = args.concat(['LANGUAGE_FIELD', parameters.languageField]);
            if(parameters.score !== undefined)
                args = args.concat(['SCORE', parameters.score])
            if(parameters.score !== undefined)
                args = args.concat(['SCORE_FIELD', parameters.scoreField])
            if(parameters.payloadField !== undefined)
                args = args.concat(['PAYLOAD_FIELD', parameters.payloadField])
            if(parameters.maxTextFields !== undefined)
                args = args.concat(['MAXTEXTFIELDS', parameters.maxTextFields.toString()])
            if(parameters.noOffsets !== undefined)
                args.push('NOOFFSETS');
            if(parameters.temporary !== undefined)
                args.push('TEMPORARY');
            if(parameters.nohl !== undefined)
                args.push('NOHL');
            if(parameters.noFields !== undefined)
                args.push('NOFIELDS');
            if(parameters.noFreqs !== undefined)
                args.push('NOFREQS');
            if(parameters.stopwords !== undefined)
                args = args.concat(['STOPWORDS', parameters.stopwords.num.toString(), parameters.stopwords.stopword]);
            if(parameters.skipInitialScan !== undefined)
                args.push('SKIPINITIALSCAN');
        }
        args.push('SCHEMA');
        for(const field of schemaFields) {
            args.concat([field.name, field.type]);
            if(field.sortable !== undefined) args.push('SORTABLE');
            if(field.noindex !== undefined) args.push('NOINDEX');
            if(field.nostem !== undefined) args.push('NOSTEM');
            if(field.phonetic !== undefined) args = args.concat(['PHONETIC', field.phonetic]);
            if(field.seperator !== undefined) args = args.concat(['SEPERATOR', field.seperator]);
            if(field.weight !== undefined) args.concat(['WEIGHT', field.weight.toString()]);
        }
        
        return await  this.redis.send_command('FT.CREATE', args);
    }

    /**
     * Searching the index with a textual query
     * @param index The index
     * @param query The query
     * @param parameters The additional optional parameter
     * @returns Array reply, where the first element is the total number of results, and then pairs of document id, and a nested array of field/value.
     */
    async search(index: string, query: string, parameters?: SearchParameters): Promise<number[]> {
        let args: string[] = [index, query];
        if(parameters !== undefined) {
            if(parameters.noContent === true)
                args.push('NOCONTENT')
            if(parameters.verbatim === true)
                args.push('VERBARIM')
            if(parameters.nonStopWords === true)
                args.push('NOSTOPWORDS')
            if(parameters.withScores === true)
                args.push('WITHSCORES')
            if(parameters.withPayloads === true)
                args.push('WITHPAYLOADS')
            if(parameters.withSortKeys === true)
                args.push('WITHSORTKEYS')
            if(parameters.filter !== undefined)
            args = args.concat(['FILTER', parameters.filter.field, parameters.filter.min.toString(), parameters.filter.max.toString()])
            if(parameters.geoFilter !== undefined)
                args.concat([
                    'GEOFILTER',
                    parameters.geoFilter.field,
                    parameters.geoFilter.lon.toString(),
                    parameters.geoFilter.lat.toString(),
                    parameters.geoFilter.radius.toString(),
                    parameters.geoFilter.measurement
                ])
            if(parameters.inKeys !== undefined)
                args = args.concat(['INKEYS', parameters.inKeys.num.toString(), parameters.inKeys.field])
            if(parameters.inFields !== undefined)
                args = args.concat(['INFIELDS', parameters.inFields.num.toString(), parameters.inFields.field])
            if(parameters.return !== undefined)
                args = args.concat(['RETURN', parameters.return.num.toString(), parameters.return.field])
            if(parameters.summarize !== undefined) {
                args.push('SUMMARIZE')
                if(parameters.summarize.fields !== undefined) {
                    args.push('FIELDS')
                    for(const field of parameters.summarize.fields) {
                        args.concat([field.num.toString(), field.field]);
                    }
                }
                if(parameters.summarize.frags !== undefined) 
                    args = args.concat(['FRAGS', parameters.summarize.frags.toString()])
                if(parameters.summarize.len !== undefined) 
                    args = args.concat(['LEN', parameters.summarize.len.toString()])
                if(parameters.summarize.seperator !== undefined) 
                    args = args.concat(['SEPARATOR', parameters.summarize.seperator])
            }
            if(parameters.highlight !== undefined) {
                if(parameters.highlight.fields !== undefined) {
                    args.push('FIELDS')
                    for(const field of parameters.highlight.fields) {
                        args = args.concat([field.num.toString(), field.field]);
                    }
                }
                if(parameters.highlight.tags !== undefined) {
                    args.push('TAGS')
                    for(const tag of parameters.highlight.tags) {
                        args = args.concat([tag.open, tag.close]);
                    }
                }
            }
            if(parameters.slop !== undefined)
                args = args.concat(['SLOP', parameters.slop.toString()])
            if(parameters.inOrder !== undefined)
                args.push('INORDER')
            if(parameters.language !== undefined)
                args = args.concat(['LANGUAGE', parameters.language])
            if(parameters.expander !== undefined)
                args = args.concat(['EXPANDER', parameters.expander])
            if(parameters.scorer !== undefined)
                args = args.concat(['SCORER', parameters.scorer])
            if(parameters.explainScore !== undefined)
                args.push('EXPLAINSCORE')
            if(parameters.payload)
                args = args.concat(['PAYLOAD', parameters.payload])
            if(parameters.sortBy !== undefined)
                args = args.concat(['SORTBY', parameters.sortBy.field, parameters.sortBy.sort])
            if(parameters.limit !== undefined)
                args = args.concat(['LIMIT', parameters.limit.first.toString(), parameters.limit.num.toString()])
        }
        return await this.redis.send_command('FT.SEARCH', args);
    }

    /**
     * Runs a search query on an index, and performs aggregate transformations on the results, extracting statistics etc from them
     * @param index The index
     * @param query The query
     * @param parameters The additional optional parameters
     * @returns Array Response. Each row is an array and represents a single aggregate result
     */
    async aggregate(index: string, query: string, parameters?: AggregateParameters): Promise<number[]> {
        let args: string[] = [index, query];
        if(parameters !== undefined) {
            if(parameters.load !== undefined) {
                args.push('LOAD')
                if(parameters.load.nargs !== undefined)
                    args.push(parameters.load.nargs);
                if(parameters.load.property !== undefined)
                    args.push(parameters.load.property);
            }
            if(parameters.groupby !== undefined){
                args.push('GROUPBY')
                if(parameters.groupby.nargs !== undefined)
                    args.push(parameters.groupby.nargs);
                if(parameters.groupby.property !== undefined)
                    args.push(parameters.groupby.property);
            }
            if(parameters.reduce !== undefined) {
                args.push('REDUCE')
                if(parameters.reduce.function !== undefined)
                    args.push(parameters.reduce.function);
                if(parameters.reduce.nargs !== undefined)
                    args.push(parameters.reduce.nargs);
                if(parameters.reduce.arg !== undefined)
                    args.push(parameters.reduce.arg);
                if(parameters.reduce.as !== undefined)
                    args = args.concat(['AS', parameters.reduce.as]);
            }
            if(parameters.sortby !== undefined) {
                args.push('SORTBY')
                if(parameters.sortby.nargs !== undefined)
                    args.push(parameters.sortby.nargs);
                if(parameters.sortby.property !== undefined)
                    args.push(parameters.sortby.property);
                if(parameters.sortby.sort !== undefined)
                    args.push(parameters.sortby.sort);
                if(parameters.sortby.max !== undefined)
                    args = args.concat(['MAX', parameters.sortby.max.toString()]);
            }
            if(parameters.apply !== undefined) {
                args.push('APPLY');
                if(parameters.apply.expression !== undefined)
                    args.push(parameters.apply.expression);
                if(parameters.apply.as !== undefined)
                    args.push(parameters.apply.as);
            }
            if(parameters.limit !== undefined) {
                args.push('LIMIT')
                if(parameters.limit.offset !== undefined)
                    args.push(parameters.limit.offset)
                if(parameters.limit.numberOfResults !== undefined)
                    args.push(parameters.limit.numberOfResults.toString());
            }
        }
        return await this.redis.send_command('FT.AGGREGATE', args);
    }

    /**
     * Retrieving the execution plan for a complex query
     * @param index The index
     * @param query The query
     * @returns Returns the execution plan for a complex query
     */
    async explain(index: string, query: string): Promise<string> {
        return await this.redis.send_command('FT.EXPLAIN', [index, query]);
    }

    /**
     * Retrieving the execution plan for a complex query but formatted for easier reading without using redis-cli --raw 
     * @param index The index
     * @param query The query
     * @returns A string representing the execution plan.
     */
    async explainCLI(index: string, query: string): Promise<string[]> {
        return await this.redis.send_command('FT.EXPLAINCLI', [index, query]);
    }

    /**
     * Adding a new field to the index
     * @param index The index
     * @param field The field name
     * @param fieldType The field type
     * @param options The additional optional parameters
     * @returns 'OK'
     */
    async alter(index: string, field: string, fieldType: FieldType, options?: FieldOptions): Promise<'OK'> {
        let args = [index, 'SCHEMA', 'ADD', field, fieldType]
        if(options !== undefined) {
            if(options.sortable !== undefined) args.push('SORTABLE');
            if(options.noindex !== undefined) args.push('NOINDEX');
            if(options.nostem !== undefined) args.push('NOSTEM');
            if(options.phonetic !== undefined) args = args.concat(['PHONETIC', options.phonetic]);
            if(options.seperator !== undefined) args = args.concat(['SEPERATOR', options.seperator]);
            if(options.weight !== undefined) args = args.concat(['WEIGHT', options.weight.toString()]);
        }
        return await this.redis.send_command('FT.ALTER', args);
    }

    /**
     * Deleting the index
     * @param index The index
     * @param deleteHash If set, the drop operation will delete the actual document hashes.
     * @returns 'OK'
     */
    async dropindex(index: string, deleteHash = false): Promise<'OK'> {
        const args = [index];
        if(deleteHash === true) args.push('DD')
        return await this.redis.send_command('FT.DROPINDEX', args);
    }
    
    /**
     * Adding alias fron an index
     * @param name The alias name
     * @param index The alias index
     * @returns 'OK'
     */
    async aliasadd(name: string, index: string): Promise<'OK'> {
        return await this.redis.send_command('FT.ALIASADD', [name, index]);
    }

    /**
     * Updating alias index
     * @param name The alias name
     * @param index The alias index
     * @returns 'OK'
     */
    async aliasupdate(name: string, index: string): Promise<'OK'> {
        return await this.redis.send_command('FT.ALIASUPDATE', [name, index]);
    }

    /**
     * Deleting alias fron an index
     * @param name The alias name
     * @returns 'OK'
     */
    async aliasdel(name: string): Promise<'OK'> {
        return await this.redis.send_command('FT.ALIASDEL', [name]);
    }
    
    /**
     * Retrieving the distinct tags indexed in a Tag field
     * @param index The index
     * @param field The field name
     * @returns The distinct tags indexed in a Tag field 
     */
    async tagvals(index: string, field: string): Promise<string[]> {
        return await this.redis.send_command('FT.TAGVALS', [index, field]);
    }

    /**
     * Adds a suggestion string to an auto-complete suggestion dictionary
     * @param key The key
     * @param suggestion The suggestion
     * @param score The score
     * @param options The additional optional parameters
     * @returns The current size of the suggestion dictionary
     */
    async sugadd(key: string, suggestion: string, score: number, options?: SugAddParameters): Promise<number>{
        let args = [key, suggestion, score];
        if(options !== undefined && options.incr !== undefined)
            args.push('INCR');
        if(options !== undefined && options.payload !== undefined)
            args = args.concat(['PAYLOAD', options.payload]);
        return await this.redis.send_command('FT.SUGADD', args);
    }

    /**
     * Retrieving completion suggestions for a prefix
     * @param key The key
     * @param prefix The prefix of the suggestion
     * @param options The additional optional parameter
     * @returns A list of the top suggestions matching the prefix, optionally with score after each entry 
     */
    async sugget(key: string, prefix: string, options?: SugGetParameters): Promise<string[]> {
        let args = [key, prefix];
        if(options !== undefined && options.fuzzy !== undefined)
            args.push('FUZZY');
        if(options !== undefined && options.max !== undefined)   
            args = args.concat(['MAX', options.max.toString()]);
        if(options !== undefined && options.withScores !== undefined)
            args.push('WITHSCORES');
        if(options !== undefined && options.withPayloads !== undefined)
            args.push('WITHPAYLOADS');
        return await this.redis.send_command('FT.SUGGET', args);
    }

    /**
     * Deleting a string from a suggestion index
     * @param key The key
     * @param suggestion The suggestion
     */
    async sugdel(key: string, suggestion: string): Promise<number> {
        return await this.redis.send_command('FT.SUGDEL', [key, suggestion]);
    }

    /**
     * Retrieving the size of an auto-complete suggestion dictionary
     * @param key The key
     */
    async suglen(key: string): Promise<number> {
        return await this.redis.send_command('FT.SUGLEN', key); 
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
        const args = [index, groupId].concat(terms);
        if(skipInitialScan === true)
            args.push('SKIPINITIALSCAN');
        return await this.redis.send_command('FT.SYNUPDATE', args); 
    }

    /**
     * Dumps the contents of a synonym group
     * @param index The index
     * @returns A list of synonym terms and their synonym group ids.  
     */
    async syndump(index: string): Promise<(string | number)[]> {
        return await this.redis.send_command('FT.SYNDUMP', [index]);
    }

    /**
     * Performs spelling correction on a query
     * @param index The index
     * @param query The query
     * @param options The additional optional parameters
     * @returns An array, in which each element represents a misspelled term from the query
     */
    async spellcheck(index: string, query: string, options?: FTSpellCheck) {
        const args = [index, query];
        if(options !== undefined && options.distance !== undefined)
            args.concat(['DISTANCE', options.distance])
        if(options !== undefined && options.terms !== undefined) {
            args.push('TERMS');
            for(const term of options.terms) {
                args.concat([term.type, term.dict]);
            }
        }
        return await this.redis.send_command('FT.SPELLCHECK', args);
    }
    
    /**
     * Adding terms to a dictionary
     * @param dict The dictionary
     * @param terms A list of terms
     * @returns The number of new terms that were added
     */
    async dictadd(dict: string, terms: string[]): Promise<number> {
        return await this.redis.send_command('FT.DICTADD', [dict].concat(terms));
    }

    /**
     * Deleting terms from a dictionary
     * @param dict The dictionary
     * @param terms A list of terms
     * @returns The number of terms that were deleted
     */
    async dictdel(dict: string, terms: string[]): Promise<number> {
        return await this.redis.send_command('FT.DICTDEL', [dict].concat(terms));
    }

    /**
     * Dumps all terms in the given dictionary
     * @param dict The dictionary
     * @returns An array, where each element is term
     */
    async dictdump(dict: string): Promise<string[]> {
        return await this.redis.send_command('FT.DICTDUMP', [dict]);
    }

    /**
     * Retrieving infromation and statistics on the index
     * @param index The index
     * @returns A nested array of keys and values. 
     */
    async info(index: string): Promise<(string | number)[]> {
        return await this.redis.send_command('FT.INFO', [index]);
    }

    /**
     * Retrieves, describes and sets runtime configuration options
     * @param command The command type
     * @param option The option
     * @param value In case of 'SET' command, a valid value to set
     * @returns If 'SET' command, returns 'OK' for valid runtime-settable option names and values. If 'GET' command, returns a string with the current option's value.
     */
    async config(command: 'GET' | 'SET' | 'HELP', option: string, value?: string): Promise<string[][]> {
        const args = [command, option];
        if(command === 'SET')
            args.push(value);
        return await this.redis.send_command('FT.CONFIG', args);
    }
}

/**
 * 
 */
export type CreateParameters = {
    //index: string,
    //on: 'HASH',
    filter?: string,
    payloadField?: string,
    maxTextFields?: number,
    noOffsets?: string,
    temporary?: number,
    nohl?: string,
    noFields?: string,
    noFreqs?: string,
    skipInitialScan?: boolean
    prefix?: {
        count: number,
        name: string
    }[],
    language?: string,
    languageField?: string,
    score?: string,
    scoreField?: string
    stopwords?: {
        num: number,
        stopword: string
    }
}

/**
 * The field parameter
 * @param sortable The 'SORTABLE' parameter. Numeric, tag or text field can have the optional SORTABLE argument that allows the user to later sort the results by the value of this field (this adds memory overhead so do not declare it on large text fields).
 * @param nostem The 'NOSTEM' parameter. Text fields can have the NOSTEM argument which will disable stemming when indexing its values. This may be ideal for things like proper names.
 * @param noindex The 'NOINDEX' parameter. Fields can have the NOINDEX option, which means they will not be indexed. This is useful in conjunction with SORTABLE , to create fields whose update using PARTIAL will not cause full reindexing of the document. If a field has NOINDEX and doesn't have SORTABLE, it will just be ignored by the index.
 * @param phonetic The 'PHONETIC' parameter. Declaring a text field as PHONETIC will perform phonetic matching on it in searches by default. The obligatory {matcher} argument specifies the phonetic algorithm and language used.
 * @param weight The 'WEIGHT' parameter. For TEXT fields, declares the importance of this field when calculating result accuracy. This is a multiplication factor, and defaults to 1 if not specified.
 * @param seperator The 'SEPERATOR' parameter. For TAG fields, indicates how the text contained in the field is to be split into individual tags. The default is , . The value must be a single character.
 */
export type FieldOptions = {
    sortable?: boolean,
    noindex?: boolean,
    nostem?: boolean,
    phonetic?: string,
    weight?: number,
    seperator?: string
}

/**
 * The parameters of the 'FT.CREATE' command, schema fields (Field comming after the 'SCHEMA' command)
 * @param name The name of the field
 * @param type The type of the field
 * @param sortable The 'SORTABLE' parameter. Numeric, tag or text field can have the optional SORTABLE argument that allows the user to later sort the results by the value of this field (this adds memory overhead so do not declare it on large text fields).
 * @param nostem The 'NOSTEM' parameter. Text fields can have the NOSTEM argument which will disable stemming when indexing its values. This may be ideal for things like proper names.
 * @param noindex The 'NOINDEX' parameter. Fields can have the NOINDEX option, which means they will not be indexed. This is useful in conjunction with SORTABLE , to create fields whose update using PARTIAL will not cause full reindexing of the document. If a field has NOINDEX and doesn't have SORTABLE, it will just be ignored by the index.
 * @param phonetic The 'PHONETIC' parameter. Declaring a text field as PHONETIC will perform phonetic matching on it in searches by default. The obligatory {matcher} argument specifies the phonetic algorithm and language used.
 * @param weight The 'WEIGHT' parameter. For TEXT fields, declares the importance of this field when calculating result accuracy. This is a multiplication factor, and defaults to 1 if not specified.
 * @param seperator The 'SEPERATOR' parameter. For TAG fields, indicates how the text contained in the field is to be split into individual tags. The default is , . The value must be a single character.
 */
export interface SchemaField extends FieldOptions {
    name: string,
    type: FieldType,
}

/**
 * 
 */
export type SearchParameters = {
    noContent?: boolean,
    verbatim?: boolean,
    nonStopWords?: boolean,
    withScores?: boolean,
    withPayloads?: boolean,
    withSortKeys?: boolean,
    filter?: {
        field: string,
        min: number,
        max: number
    },
    geoFilter?: {
        field: string,
        lon: number,
        lat: number,
        radius: number,
        measurement: 'm' | 'km' | 'mi' | 'ft'
    },
    inKeys?: {
        num: number,
        field: string
    },
    inFields?: {
        num: number,
        field: string
    },
    return?: {
        num: number,
        field: string
    },
    summarize?: {
        fields?: {
            num: number,
            field: string
        }[],
        frags?: number,
        len?: number,
        seperator?: string
    },
    highlight?: {
        fields?: {
            num: number,
            field: string
        }[],
        tags?: {
            open: string,
            close: string
        }[]
    },
    slop?: number,
    inOrder?: boolean,
    language?: string,
    expander?: string,
    scorer?: string,
    explainScore?: boolean,
    payload?: string,
    sortBy?: {
        field: string,
        sort: 'ASC' | 'DESC'
    },
    limit?: {
        first: number,
        num: number
    }
}

/**
 * The additional parameter of 'FT.AGGREGATE' command
 * @param load The 'LOAD' parameter. 
 * @param groupby The 'GROUPBY' parameter. 
 * @param sortby The 'SORTBY' parameter. 
 * @param apply The 'APPLY' parameter. 
 * @param limit The 'LIMIT' parameter.
 * @param filter The 'FILTER' parameter.
 */
export type AggregateParameters = {
    load?: {
        nargs: string,
        property: string
    },
    groupby?: {
        nargs: string,
        property: string
    },
    reduce?: {
        function: string,
        nargs: string,
        arg: string,
        as: string
    },
    sortby?: {
        nargs: string,
        property: string,
        sort: 'ASC' | 'DESC',
        max: number
    },
    apply?: {
        expression: string,
        as: string
    },
    limit?: {
        offset: string,
        numberOfResults: number
    },
    filter?: string
}

/**
 * The additional parameters of 'FT.SUGADD' command
 * @param incr The 'INCR' parameter. if set, we increment the existing entry of the suggestion by the given score, instead of replacing the score. This is useful for updating the dictionary based on user queries in real time
 * @param payload The 'PAYLOAD' parameter. If set, we save an extra payload with the suggestion, that can be fetched by adding the WITHPAYLOADS argument to FT.SUGGET
 */
export type SugAddParameters = {
    incr: number,
    payload: string
}

/**
 * The additional parameters of 'FT.SUGGET' command
 * @param fuzzy The 'FUZZY' parameter. if set, we do a fuzzy prefix search, including prefixes at Levenshtein distance of 1 from the prefix sent
 * @param max The 'MAX' parameter. If set, we limit the results to a maximum of num (default: 5).
 * @param withScores The 'WITHSCORES' parameter. If set, we also return the score of each suggestion. this can be used to merge results from multiple instances
 * @param withPayloads The 'WITHPAYLOADS' parameter. If set, we return optional payloads saved along with the suggestions. If no payload is present for an entry, we return a Null Reply.
 */
export type SugGetParameters = {
    fuzzy: string,
    max: number,
    withScores: boolean,
    withPayloads: boolean
}

/**
 * The additional parameters of 'FT.SPELLCHECK' command
 * @param terms A list of terms
 * @param terms.type The type of the term
 * @param terms.dict The dict of the term
 * @param distance The maximal Levenshtein distance for spelling suggestions (default: 1, max: 4)
 */
export type FTSpellCheck = {
    terms?: {
        type: 'INCLUDE' | 'EXCLUDE',
        dict?: string
    }[],
    distance?: string
}

/**
 * The available field types
 * @param TEXT The text type
 * @param NUMERIC The number type
 * @param TAG The tag type
 */
export type FieldType = 'TEXT' | 'NUMERIC' | 'TAG' | string;