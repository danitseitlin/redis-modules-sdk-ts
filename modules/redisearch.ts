
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

    async create(parameters: CreateParameters, schemaFields: SchemaField[]) {
        let args: string[] = [parameters.index.toString()]
        args = args.concat(['ON', parameters.on]);
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

    /*async hset(hash: string, fields: {[key: string]: string}) {
        const args: string[] = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field]);
        }
        return await  this.redis.send_command('HSET', args);
    }

    async hsetnx(hash: string, fields: {[key: string]: string}) {
        const args: string[] = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field]);
        }
        return await  this.redis.send_command('HSETNX', args);
    }

    async hdel(hash: string, fields: {[key: string]: string}) {
        const args: string[] = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field]);
        }
        return await  this.redis.send_command('HDEL', args);
    }

    async hincrby(hash: string, fields: {[key: string]: number}) {
        const args: string[] = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field].toString());
        }
        return await  this.redis.send_command('HINCRBY', args);
    }

    async hdecrby(hash: string, fields: {[key: string]: number}) {
        const args: string[] = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field].toString());
        }
        return await  this.redis.send_command('HDECRBY', args);
    }*/

    async search(parameters: SearchParameters) {
        let args: string[] = [parameters.index.toString(), parameters.query];
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
        return await this.redis.send_command('FT.SEARCH', args);
    }

    async aggregate(parameters: AggregateParameters) {
        let args: string[] = []
        if(parameters.indexName !== undefined)
            args.push(parameters.indexName)
        if(parameters.query !== undefined)
            args.push(parameters.query)
        if(parameters.load !== undefined) {
            args.push('LOAD')
            if(parameters.load.nargs !== undefined)
                args.push(parameters.load.nargs);
            if(parameters.load.property !== undefined)
                args.push(parameters.load.property);
        }
        if(parameters.groupBy !== undefined){
            args.push('GROUPBY')
            if(parameters.groupBy.nargs !== undefined)
                args.push(parameters.groupBy.nargs);
            if(parameters.groupBy.property !== undefined)
                args.push(parameters.groupBy.property);
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
        return await this.redis.send_command('FT.AGGREGATE', args);
    }
    async explain(index: string, query: string) {
        return await this.redis.send_command('FT.EXPLAIN', [index, query]);
    }
    async explainCLI(index: string, query: string) {
        return await this.redis.send_command('FT.EXPLAINCLI', [index, query]);
    }
    async alter(index: string, field: string, options: AlterOptions) {
        let args = [index, field, options.type]
        if(options.sortable !== undefined) args.push('SORTABLE');
        if(options.noindex !== undefined) args.push('NOINDEX');
        if(options.nostem !== undefined) args.push('NOSTEM');
        if(options.phonetic !== undefined) args = args.concat(['PHONETIC', options.phonetic]);
        if(options.seperator !== undefined) args = args.concat(['SEPERATOR', options.seperator]);
        if(options.weight !== undefined) args = args.concat(['WEIGHT', options.weight.toString()]);
        return await this.redis.send_command('FT.ALTER', args);
    }
    async dropindex(index: string, deleteHash = false) {
        const args = [index];
        if(deleteHash === true) args.push('DD')
        return await this.redis.send_command('FT.DROPINDEX', args);
    }
    async aliasadd(name: string, index: string) {
        return await this.redis.send_command('FT.ALIASADD', [name, index]);
    }
    async aliasupdate(name: string, index: string) {
        return await this.redis.send_command('FT.ALIASUPDATE', [name, index]);
    }
    async aliasdel(name: string, index: string) {
        return await this.redis.send_command('FT.ALIASDEL', [name, index]);
    }
    async tagvalgs(index: string, field: string) {
        return await this.redis.send_command('FT.TAGVALS', [index, field]);
    }
    async sugadd(key: string, string: string, score: number, options: SugAddParameters) {
        let args = [key, string, score];
        if(options.incr !== undefined)
            args.push('INCR');
        if(options.payload !== undefined)
            args = args.concat(['PAYLOAD', options.payload]);
        return await this.redis.send_command('FT.SUGADD', args);
    }
    async sugget(key: string, prefix: string, options: SugGetParameters) {
        let args = [key, prefix];
        if(options.fuzzy !== undefined)
            args.push('FUZZY');
        if(options.max !== undefined)   
            args = args.concat(['MAX', options.max.toString()]);
        if(options.withScores !== undefined)
            args.push('WITHSCORES');
        if(options.withPayloads !== undefined)
            args.push('WITHPAYLOADS');
        return await this.redis.send_command('FT.SUGGET', args);
    }
    async sugdel(key: string, string: string) {
        return await this.redis.send_command('FT.SUGDEL', [key, string]);
    }
    async suglen(key: string) {
        return await this.redis.send_command('FT.SUGLEN', key); 
    }
    async synupdate(index: string, groupId: number, terms: string[], skipInitialScan = false) {
        const args = [index, groupId].concat(terms);
        if(skipInitialScan === true)
            args.push('SKIPINITIALSCAN');
        return await this.redis.send_command('FT.SYNUPDATE', args); 
    }
    async syndump(index: string) {
        return await this.redis.send_command('FT.SYNDUMP', [index]);
    }
    async spellcheck() {

    }
    async dictadd(dict: string, terms: string[]) {
        return await this.redis.send_command('FT.DICTADD', [dict].concat(terms));
    }
    async dictdel(dict: string, terms: string[]) {
        return await this.redis.send_command('FT.DICTDEL', [dict].concat(terms));
    }
    async dictdump(dict: string) {
        return await this.redis.send_command('FT.DICTDUMP', [dict]);
    }
    async info(index: string) {
        return await this.redis.send_command('FT.INFO', [index]);
    }
    async config(command: 'GET' | 'SET' | 'HELP', option: string, value?: string) {
        const args = [command, option];
        if(command === 'SET')
            args.push(value);
        return await this.redis.send_command('FT.CONFIG', args);
    }
}

export type CreateParameters = {
    index: string,
    on: 'HASH',
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

export type FieldOptions = {
    sortable?: boolean,
    noindex?: boolean,
    nostem?: boolean,
    phonetic?: string,
    weight?: number,
    seperator?: string
}

export interface AlterOptions extends FieldOptions {
    type?: 'TEXT' | 'NUMERIC' | 'TAG' | string
}

export interface SchemaField extends FieldOptions {
    name: string,
    type: 'TEXT' | 'NUMERIC' | 'TAG' | string,
}

export type SearchParameters = {
    index: string,
    query: string,
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

export type AggregateParameters = {
    indexName: string,
    query: string,
    load?: {
        nargs: string,
        property: string
    },
    groupBy?: {
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
    filter: string
}

export type SugAddParameters = {
    incr: number,
    payload: string
}

export type SugGetParameters = {
    fuzzy: string,
    max: number,
    withScores: boolean,
    withPayloads: boolean
}