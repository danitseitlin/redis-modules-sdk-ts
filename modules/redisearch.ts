
import * as Redis from 'ioredis';
import { inherits } from 'util';

export class RediSearch extends Redis {
    /**
     * Initializing the RediSearch object. Initialization starts an active connection to the Redis database
     * @param options The options of the Redis database.
     */
    constructor(options: Redis.RedisOptions) {
        super(options)
    }

    async createCommand(parameters: CreateParameters, schemaFields: SchemaField[]) {
        const args = [parameters.index.toString()]
        args.concat(['ON', parameters.on]);
        if(parameters.prefix !== undefined) {
            args.push('PREFIX');
            for(const prefix of parameters.prefix)
                args.concat([prefix.count.toString(), prefix.name])
        }
        if(parameters.filter !== undefined)
            args.concat(['FILTER', parameters.filter])
        if(parameters.language !== undefined)
            args.concat(['LANGUAGE', parameters.language]);
        if(parameters.languageField !== undefined)
            args.concat(['LANGUAGE_FIELD', parameters.languageField]);
        if(parameters.score !== undefined)
            args.concat(['SCORE', parameters.score])
        if(parameters.score !== undefined)
            args.concat(['SCORE_FIELD', parameters.scoreField])
        if(parameters.payloadField !== undefined)
            args.concat(['PAYLOAD_FIELD', parameters.payloadField])
        if(parameters.maxTextFields !== undefined)
            args.concat(['MAXTEXTFIELDS', parameters.maxTextFields.toString()])
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
            args.concat(['STOPWORDS', parameters.stopwords.num.toString(), parameters.stopwords.stopword]);
        if(parameters.skipInitialScan !== undefined)
            args.push('SKIPINITIALSCAN');
        args.push(': SCHEMA');
        for(const field of schemaFields) {
            args.concat([field.name, field.type]);
            if(field.sortable !== undefined) args.push('SORTABLE');
            if(field.noindex !== undefined) args.push('NOINDEX');
            if(field.nostem !== undefined) args.push('NOSTEM');
            if(field.phonetic !== undefined) args.concat(['PHONETIC', field.phonetic]);
            if(field.seperator !== undefined) args.concat(['SEPERATOR', field.seperator]);
            if(field.weight !== undefined) args.concat(['WEIGHT', field.weight.toString()]);
        }
        return await this.send_command('FT.CREATE', args);
    }

    async hsetCommand(hash: string, fields: {[key: string]: string}) {
        const args = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field]);
        }
        return await this.send_command('HSET', args);
    }

    async hsetnxCommand(hash: string, fields: {[key: string]: string}) {
        const args = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field]);
        }
        return await this.send_command('HSETNX', args);
    }

    async hdelCommand(hash: string, fields: {[key: string]: string}) {
        const args = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field]);
        }
        return await this.send_command('HDEL', args);
    }

    async hincrbyCommand(hash: string, fields: {[key: string]: number}) {
        const args = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field].toString());
        }
        return await this.send_command('HINCRBY', args);
    }

    async hdecrbyCommand(hash: string, fields: {[key: string]: number}) {
        const args = [hash];
        for(const field in fields) {
            args.push(field);
            args.push(fields[field].toString());
        }
        return await this.send_command('HDECRBY', args);
    }

    async searchCommand(parameters: SearchParameters) {
        const args = [parameters.index.toString(), parameters.query];
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
            args.concat(['FILTER', parameters.filter.field, parameters.filter.min.toString(), parameters.filter.max.toString()])
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
            args.concat(['INKEYS', parameters.inKeys.num.toString(), parameters.inKeys.field])
        if(parameters.inFields !== undefined)
            args.concat(['INFIELDS', parameters.inFields.num.toString(), parameters.inFields.field])
        if(parameters.return !== undefined)
            args.concat(['RETURN', parameters.return.num.toString(), parameters.return.field])
        if(parameters.summarize !== undefined) {
            args.push('SUMMARIZE')
            if(parameters.summarize.fields !== undefined) {
                args.push('FIELDS')
                for(const field of parameters.summarize.fields) {
                    args.concat([field.num.toString(), field.field]);
                }
            }
            if(parameters.summarize.frags !== undefined) 
                args.concat(['FRAGS', parameters.summarize.frags.toString()])
            if(parameters.summarize.len !== undefined) 
                args.concat(['LEN', parameters.summarize.len.toString()])
            if(parameters.summarize.seperator !== undefined) 
                args.concat(['SEPARATOR', parameters.summarize.seperator])
        }
        if(parameters.highlight !== undefined) {
            if(parameters.highlight.fields !== undefined) {
                args.push('FIELDS')
                for(const field of parameters.highlight.fields) {
                    args.concat([field.num.toString(), field.field]);
                }
            }
            if(parameters.highlight.tags !== undefined) {
                args.push('TAGS')
                for(const tag of parameters.highlight.tags) {
                    args.concat([tag.open, tag.close]);
                }
            }
        }
        if(parameters.slop !== undefined)
            args.concat(['SLOP', parameters.slop.toString()])
        if(parameters.inOrder !== undefined)
            args.push('INORDER')
        if(parameters.language !== undefined)
            args.concat(['LANGUAGE', parameters.language])
        if(parameters.expander !== undefined)
            args.concat(['EXPANDER', parameters.expander])
        if(parameters.scorer !== undefined)
            args.concat(['SCORER', parameters.scorer])
        if(parameters.explainScore !== undefined)
            args.push('EXPLAINSCORE')
        if(parameters.payload)
            args.concat(['PAYLOAD', parameters.payload])
        if(parameters.sortBy !== undefined)
            args.concat(['SORTBY', parameters.sortBy.field, parameters.sortBy.sort])
        if(parameters.limit !== undefined)
            args.concat(['LIMIT', parameters.limit.first.toString(), parameters.limit.num.toString()])
    }
}

export type CreateParameters = {
    index: number,
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

export interface SchemaField extends FieldOptions {
    name: string,
    type: 'TEXT' | 'NUMERIC' | 'TAG' | string,
}

export type SearchParameters = {
    index: number,
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