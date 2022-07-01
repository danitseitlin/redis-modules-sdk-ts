import {
    FTIndexType, FTSchemaField, FTCreateParameters, FTSearchParameters, FTAggregateParameters, FTFieldType,
    FTFieldOptions, FTSugAddParameters, FTSugGetParameters, FTSpellCheck
} from "./redisearch.types";
import { CommandData } from "../module.base";

export class SearchCommander {

    /**
     * Creating an index with a given spec
     * @param index The index of the schema
     * @param indexType The index type of the schema
     * @param schemaFields The filter set after the 'SCHEMA' argument
     * @param parameters The additional parameters of the spec
     * @returns 'OK' or error
     */
    create(index: string, indexType: FTIndexType, schemaFields: FTSchemaField[], parameters?: FTCreateParameters): CommandData {
        let args: string[] = [index, 'ON', indexType]
        if(parameters !== undefined) {
            if(parameters.prefix !== undefined) {
                args.push('PREFIX')
                if(parameters.prefix.num !== undefined) {
                    args.push(`${parameters.prefix.num}`)
                } else if(Array.isArray(parameters.prefix.prefixes)) {
                    args.push(`${parameters.prefix.prefixes.length}`)
                } else {
                    args.push("1")
                }
                args = args.concat(parameters.prefix.prefixes);
            }
            if(parameters.filter !== undefined)
                args = args.concat(['FILTER', parameters.filter])
            if(parameters.language !== undefined)
                args = args.concat(['LANGUAGE', parameters.language]);
            if(parameters.languageField !== undefined)
                args = args.concat(['LANGUAGE_FIELD', parameters.languageField])
            if(parameters.score !== undefined)
                args = args.concat(['SCORE', parameters.score])
            if(parameters.scoreField !== undefined)
                args = args.concat(['SCORE_FIELD', parameters.scoreField])
            if(parameters.payloadField !== undefined)
                args = args.concat(['PAYLOAD_FIELD', parameters.payloadField])
            if(parameters.maxTextFields !== undefined)
                args = args.concat(['MAXTEXTFIELDS', `${parameters.maxTextFields}`])
            if(parameters.temporary !== undefined)
                args = args.concat(['TEMPORARY', `${parameters.temporary}`])
            if(parameters.noOffsets === true)
                args.push('NOOFFSETS')
            if(parameters.nohl === true)
                args.push('NOHL')
            if(parameters.noFields === true)
                args.push('NOFIELDS')
            if(parameters.noFreqs === true)
                args.push('NOFREQS')
            if(parameters.stopwords !== undefined) {
                args.push('STOPWORDS')
                if(parameters.stopwords.num !== undefined) {
                    args.push(`${parameters.stopwords.num}`)
                } else if(Array.isArray(parameters.stopwords.stopwords)) {
                    args.push(`${parameters.stopwords.stopwords.length}`)
                } else {
                    args.push("1")
                }
                args = args.concat(parameters.stopwords.stopwords);
            }
            if(parameters.skipInitialScan === true)
                args.push('SKIPINITIALSCAN')
        }
        args.push('SCHEMA');
        for(const field of schemaFields) {
            args.push(field.name)
            if(field.as !== undefined)
                args = args.concat(['AS', field.as])
            args.push(field.type);
            if(field.nostem === true) args.push('NOSTEM');
            if(field.weight !== undefined) args = args.concat(['WEIGHT', `${field.weight}`])
            if(field.phonetic !== undefined) args = args.concat(['PHONETIC', field.phonetic])
            if(field.separator !== undefined) args = args.concat(['SEPARATOR', field.separator])
            if(field.sortable === true) args.push('SORTABLE')
            if(field.noindex === true) args.push('NOINDEX')
            if(field.unf === true) args.push('UNF')
            if(field.caseSensitive === true) args.push('CASESENSITIVE')
        }
        return {
            command: 'FT.CREATE',
            args: args
        }
    }

    /**
     * Searching the index with a textual query
     * @param index The index
     * @param query The query
     * @param parameters The additional optional parameter
     * @returns Array reply, where the first element is the total number of results, and then pairs of document id, and a nested array of field/value.
     */
    search(index: string, query: string, parameters?: FTSearchParameters): CommandData {
        let args: string[] = [index, query];
        if(parameters !== undefined) {
            if(parameters.noContent === true)
                args.push('NOCONTENT')
            if(parameters.verbatim === true)
                args.push('VERBATIM')
            if(parameters.noStopWords === true)
                args.push('NOSTOPWORDS')
            if(parameters.withScores === true)
                args.push('WITHSCORES')
            if(parameters.withPayloads === true)
                args.push('WITHPAYLOADS')
            if(parameters.withSortKeys === true)
                args.push('WITHSORTKEYS')
            if(parameters.filter !== undefined) {
                for(const filterItem of parameters.filter) {
                    args = args.concat(['FILTER', filterItem.field, `${filterItem.min}`, `${filterItem.max}`])
                }
            }
            if(parameters.geoFilter !== undefined)
                args = args.concat([
                    'GEOFILTER',
                    parameters.geoFilter.field,
                    `${parameters.geoFilter.lon}`,
                    `${parameters.geoFilter.lat}`,
                    `${parameters.geoFilter.radius}`,
                    parameters.geoFilter.measurement
                ])
            if(parameters.inKeys !== undefined) {
                args.push('INKEYS')
                if(parameters.inKeys.num !== undefined) {
                    args.push(`${parameters.inKeys.num}`)
                } else if(Array.isArray(parameters.inKeys.keys)) {
                    args.push(`${parameters.inKeys.keys.length}`)
                } else {
                    args.push("1")
                }
                args = args.concat(parameters.inKeys.keys);
            }
            if(parameters.inFields !== undefined) {
                args.push('INFIELDS');
                if(parameters.inFields.num !== undefined) {
                    args.push(`${parameters.inFields.num}`)
                } else if(Array.isArray(parameters.inFields.fields)) {
                    args.push(`${parameters.inFields.fields.length}`)
                } else {
                    args.push("1")
                }
                args = args.concat(parameters.inFields.fields);
            }
            if(parameters.return !== undefined) {
                args = args.concat([
                    'RETURN',
                    parameters.return.num !== undefined ?
                        `${parameters.return.num}` :
                        `${parameters.return.fields.length}`,
                ]).concat(
                    ...parameters.return.fields.map(
                        (field) => {
                            if(field.as !== undefined) {
                                return [field.field, 'AS', field.as];
                            }
                            return [field.field];
                        },
                    )
                );
            }
            if(parameters.summarize !== undefined) {
                args.push('SUMMARIZE')
                if(parameters.summarize.fields !== undefined) {
                    args.push('FIELDS')
                    if(parameters.summarize.fields.num !== undefined) {
                        args.push(`${parameters.summarize.fields.num}`)
                    } else if(Array.isArray(parameters.summarize.fields.fields)) {
                        args.push(`${parameters.summarize.fields.fields.length}`)
                    } else {
                        args.push("1")
                    }
                    args = args.concat(parameters.summarize.fields.fields)
                }
                if(parameters.summarize.frags !== undefined)
                    args = args.concat(['FRAGS', `${parameters.summarize.frags}`])
                if(parameters.summarize.len !== undefined)
                    args = args.concat(['LEN', `${parameters.summarize.len}`])
                if(parameters.summarize.separator !== undefined)
                    args = args.concat(['SEPARATOR', parameters.summarize.separator])
            }
            if(parameters.highlight !== undefined) {
                args.push('HIGHLIGHT')
                if(parameters.highlight.fields !== undefined) {
                    args.push('FIELDS');
                    if(parameters.highlight.fields.num !== undefined) {
                        args.push(`${parameters.highlight.fields.num}`)
                    } else if(Array.isArray(parameters.highlight.fields.fields)) {
                        args.push(`${parameters.highlight.fields.fields.length}`)
                    } else {
                        args.push("1")
                    }
                    args = args.concat(parameters.highlight.fields.fields);
                }
                if(parameters.highlight.tags !== undefined) {
                    args.push('TAGS')
                    args = args.concat([parameters.highlight.tags.open, parameters.highlight.tags.close])
                }
            }
            if(parameters.slop !== undefined) {
                args = args.concat(['SLOP', `${parameters.slop}`])
            }
            if(parameters.inOrder === true) {
                args.push('INORDER')
            }
            if(parameters.language !== undefined) {
                args = args.concat(['LANGUAGE', parameters.language])
            }
            if(parameters.expander !== undefined) {
                args = args.concat(['EXPANDER', parameters.expander])
            }
            if(parameters.scorer !== undefined) {
                args = args.concat(['SCORER', parameters.scorer])
            }
            if(parameters.explainScore === true) {
                args.push('EXPLAINSCORE')
            }
            if(parameters.payload) {
                args = args.concat(['PAYLOAD', parameters.payload])
            }
            if(parameters.sortBy !== undefined) {
                args = args.concat(['SORTBY', parameters.sortBy.field, parameters.sortBy.sort])
            }
            if(parameters.limit !== undefined) {
                args = args.concat(['LIMIT', `${parameters.limit.first}`, `${parameters.limit.num}`])
            }
            if(parameters.dialect !== undefined) {
                args = args.concat(['DIALECT', parameters.dialect])
            }
        }
        return {
            command: 'FT.SEARCH',
            args: args
        }
    }

    /**
     * Runs a search query on an index, and performs aggregate transformations on the results, extracting statistics etc from them
     * @param index The index
     * @param query The query
     * @param parameters The additional optional parameters
     * @returns Array Response. Each row is an array and represents a single aggregate result
     */
    aggregate(index: string, query: string, parameters?: FTAggregateParameters): CommandData {
        let args: string[] = [index, query];
        if(parameters !== undefined) {
            if(parameters.load !== undefined) {
                args.push('LOAD')
                if(parameters.load.nargs !== undefined)
                    args.push(parameters.load.nargs);
                if(parameters.load.properties !== undefined)
                    parameters.load.properties.forEach(property => {
                        args.push(property);
                    })
            }
            if(parameters.apply !== undefined) {
                parameters.apply.forEach(apply => {
                    args.push('APPLY');
                    args.push(apply.expression);
                    if(apply.as)
                        args = args.concat(['AS', apply.as]);
                })
            }
            if(parameters.groupby !== undefined) {
                args.push('GROUPBY')
                if(parameters.groupby.nargs !== undefined)
                    args.push(parameters.groupby.nargs);
                if(parameters.groupby.properties !== undefined) {
                    parameters.groupby.properties.forEach((property) => {
                        args.push(property);
                    })
                }
            }
            if(parameters.reduce !== undefined) {
                parameters.reduce.forEach(reduce => {
                    args.push('REDUCE')
                    if(reduce.function !== undefined)
                        args.push(reduce.function);
                    if(reduce.nargs !== undefined)
                        args.push(reduce.nargs);
                    if(reduce.args)
                        reduce.args.forEach(arg => {
                            args.push(arg);
                        })
                    if(reduce.as !== undefined)
                        args = args.concat(['AS', reduce.as]);
                })
            }
            if(parameters.sortby !== undefined) {
                args.push('SORTBY')
                if(parameters.sortby.nargs !== undefined)
                    args.push(parameters.sortby.nargs);
                if(parameters.sortby.properties)
                    parameters.sortby.properties.forEach(property => {
                        args.push(property.property);
                        args.push(property.sort);
                    })
                if(parameters.sortby.max !== undefined){
                    args = args.concat(['MAX', `${parameters.sortby.max}`]);
                }
            }
            if(parameters.expressions !== undefined) {
                parameters.expressions.forEach(expression => {
                    args.push('APPLY');
                    args.push(expression.expression);
                    if(expression.as){
                        args = args.concat(['AS', expression.as]);
                    }
                })
            }
            if(parameters.limit !== undefined) {
                args.push('LIMIT')
                if(parameters.limit.offset !== undefined)
                    args.push(parameters.limit.offset)
                if(parameters.limit.numberOfResults !== undefined)
                    args.push(`${parameters.limit.numberOfResults}`);
            }
            if(parameters.filter !== undefined) {
                args = args.concat(['FILTER', parameters.filter])
            }
            if(parameters.dialect !== undefined) {
                args = args.concat(['DIALECT', parameters.dialect])
            }
        }
        return {
            command: 'FT.AGGREGATE',
            args: args
        }
    }

    /**
     * Retrieving the execution plan for a complex query
     * @param index The index
     * @param query The query
     * @returns Returns the execution plan for a complex query
     */
    explain(index: string, query: string): CommandData {
        return {
            command: 'FT.EXPLAIN',
            args: [index, query]
        }
    }

    /**
     * Retrieving the execution plan for a complex query but formatted for easier reading without using redis-cli --raw
     * @param index The index
     * @param query The query
     * @returns A string representing the execution plan.
     */
    explainCLI(index: string, query: string): CommandData {
        return {
            command: 'FT.EXPLAINCLI',
            args: [index, query]
        }
    }

    /**
     * Adding a new field to the index
     * @param index The index
     * @param field The field name
     * @param fieldType The field type
     * @param options The additional optional parameters
     * @returns 'OK' or error
     */
    alter(index: string, field: string, fieldType: FTFieldType, options?: FTFieldOptions): CommandData {
        let args = [index, 'SCHEMA', 'ADD', field, fieldType]
        if(options !== undefined) {
            if(options.nostem === true) args.push('NOSTEM')
            if(options.weight !== undefined) args = args.concat(['WEIGHT', `${options.weight}`])
            if(options.phonetic !== undefined) args = args.concat(['PHONETIC', options.phonetic])
            if(options.separator !== undefined) args = args.concat(['SEPARATOR', options.separator])
            if(options.sortable === true) args.push('SORTABLE')
            if(options.noindex === true) args.push('NOINDEX')
            if(options.unf === true) args.push('UNF')
            if(options.caseSensitive === true) args.push('CASESENSITIVE')
        }
        return {
            command: 'FT.ALTER',
            args: args
        }
    }

    /**
     * Deleting the index
     * @param index The index
     * @param deleteHash If set, the drop operation will delete the actual document hashes.
     * @returns 'OK' or error
     */
    dropindex(index: string, deleteHash = false): CommandData {
        const args = [index];
        if(deleteHash === true) args.push('DD')
        return {
            command: 'FT.DROPINDEX',
            args: args
        }
    }

    /**
     * Adding alias fron an index
     * @param name The alias name
     * @param index The alias index
     * @returns 'OK' or error
     */
    aliasadd(name: string, index: string): CommandData {
        return {
            command: 'FT.ALIASADD',
            args: [name, index]
        }
    }

    /**
     * Updating alias index
     * @param name The alias name
     * @param index The alias index
     * @returns 'OK' or error
     */
    aliasupdate(name: string, index: string): CommandData {
        return {
            command: 'FT.ALIASUPDATE',
            args: [name, index]
        }
    }

    /**
     * Deleting alias fron an index
     * @param name The alias name
     * @returns 'OK' or error
     */
    aliasdel(name: string): CommandData {
        return {
            command: 'FT.ALIASDEL',
            args: [name]
        }
    }

    /**
     * Retrieving the distinct tags indexed in a Tag field
     * @param index The index
     * @param field The field name
     * @returns The distinct tags indexed in a Tag field
     */
    tagvals(index: string, field: string): CommandData {
        return {
            command: 'FT.TAGVALS',
            args: [index, field]
        }
    }

    /**
     * Adds a suggestion string to an auto-complete suggestion dictionary
     * @param key The key
     * @param suggestion The suggestion
     * @param score The score
     * @param options The additional optional parameters
     * @returns The current size of the suggestion dictionary
     */
    sugadd(key: string, suggestion: string, score: number, options?: FTSugAddParameters): CommandData {
        let args = [key, suggestion, score];
        if(options !== undefined) {
            if(options.incr === true)
                args.push('INCR');
            if(options.payload !== undefined)
                args = args.concat(['PAYLOAD', options.payload]);
        }
        return {
            command: 'FT.SUGADD',
            args: args
        }
    }

    /**
     * Retrieving completion suggestions for a prefix
     * @param key The key
     * @param prefix The prefix of the suggestion
     * @param options The additional optional parameter
     * @returns A list of the top suggestions matching the prefix, optionally with score after each entry
     */
    sugget(key: string, prefix: string, options?: FTSugGetParameters): CommandData {
        let args = [key, prefix];
        if(options !== undefined) {
            if(options.fuzzy === true)
                args.push('FUZZY');
            if(options.max !== undefined)
                args = args.concat(['MAX', `${options.max}`]);
            if(options.withScores === true)
                args.push('WITHSCORES');
            if(options.withPayloads === true)
                args.push('WITHPAYLOADS');
        }
        return {
            command: 'FT.SUGGET',
            args: args
        }
    }

    /**
     * Deleting a string from a suggestion index
     * @param key The key
     * @param suggestion The suggestion
     */
    sugdel(key: string, suggestion: string): CommandData {
        return {
            command: 'FT.SUGDEL',
            args: [key, suggestion]
        }
    }

    /**
     * Retrieving the size of an auto-complete suggestion dictionary
     * @param key The key
     */
    suglen(key: string): CommandData {
        return {
            command: 'FT.SUGLEN',
            args: [key]
        }
    }

    /**
     * Updating a synonym group
     * @param index The index
     * @param groupId The group id
     * @param terms A list of terms
     * @param skipInitialScan If set, we do not scan and index.
     * @returns 'OK'
     */
    synupdate(index: string, groupId: number, terms: string[], skipInitialScan = false): CommandData {
        let args = [index, groupId];
        if(skipInitialScan === true)
            args.push('SKIPINITIALSCAN');
        args = args.concat(terms);
        return {
            command: 'FT.SYNUPDATE',
            args: args
        }
    }

    /**
     * Dumps the contents of a synonym group
     * @param index The index
     * @returns A list of synonym terms and their synonym group ids.
     */
    syndump(index: string): CommandData {
        return {
            command: 'FT.SYNDUMP',
            args: [index]
        }
    }

    /**
     * Performs spelling correction on a query
     * @param index The index
     * @param query The query
     * @param options The additional optional parameters
     * @returns An array, in which each element represents a misspelled term from the query
     */
    spellcheck(index: string, query: string, options?: FTSpellCheck): CommandData {
        let args = [index, query];
        if(options !== undefined) {
            if(options.distance !== undefined)
                args = args.concat(['DISTANCE', `${options.distance}`]);
            if(options.terms !== undefined) {
                args.push('TERMS');
                for(const term of options.terms) {
                    args = args.concat([term.type, term.dict]);
                }
            }
        }
        return {
            command: 'FT.SPELLCHECK',
            args: args
        }
    }

    /**
     * Adding terms to a dictionary
     * @param dict The dictionary
     * @param terms A list of terms
     * @returns The number of new terms that were added
     */
    dictadd(dict: string, terms: string[]): CommandData {
        return {
            command: 'FT.DICTADD',
            args: [dict].concat(terms)
        }
    }

    /**
     * Deleting terms from a dictionary
     * @param dict The dictionary
     * @param terms A list of terms
     * @returns The number of terms that were deleted
     */
    dictdel(dict: string, terms: string[]): CommandData {
        return {
            command: 'FT.DICTDEL',
            args: [dict].concat(terms)
        }
    }

    /**
     * Dumps all terms in the given dictionary
     * @param dict The dictionary
     * @returns An array, where each element is term
     */
    dictdump(dict: string): CommandData {
        return {
            command: 'FT.DICTDUMP',
            args: [dict]
        }
    }

    /**
     * Retrieving infromation and statistics on the index
     * @param index The index
     * @returns A nested array of keys and values.
     */
    info(index: string): CommandData {
        return {
            command: 'FT.INFO',
            args: [index]
        }
    }

    /**
     * Retrieves, describes and sets runtime configuration options
     * @param command The command type
     * @param option The option
     * @param value In case of 'SET' command, a valid value to set
     * @returns If 'SET' command, returns 'OK' for valid runtime-settable option names and values. If 'GET' command, returns a string with the current option's value.
     */
    config(command: 'GET' | 'SET' | 'HELP', option: string, value?: string): CommandData {
        const args = [command, option];
        if(command === 'SET'){
            args.push(value);
        }
        return {
            command: 'FT.CONFIG',
            args: args
        }
    }
}