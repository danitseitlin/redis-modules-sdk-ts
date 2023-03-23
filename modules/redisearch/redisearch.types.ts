/**
 * The 'FT.CREATE' additional optional parameters
*/
export interface FTCreateParameters {
    /**
    * The expression of the 'FILTER' parameter. is a filter expression with the full RediSearch aggregation expression language.
    */
    filter?: string,
    /**
    * The field of the 'PAYLOAD' parameter. If set indicates the document field that should be used as a binary safe payload string to the document, that can be evaluated at query time by a custom scoring function, or retrieved to the client.
    */
    payloadField?: string,
    /**
    * The 'MAXTEXTFIELDS' parameter. For efficiency, RediSearch encodes indexes differently if they are created with less than 32 text fields.
    */
    maxTextFields?: number,
    /**
    * The 'NOFFSETS' parameter. If set, we do not store term offsets for documents (saves memory, does not allow exact searches or highlighting).
    */
    noOffsets?: boolean,
    /**
    * The 'TEMPORARY' parameter. Create a lightweight temporary index which will expire after the specified period of inactivity.
    */
    temporary?: number,
    /** 
    * The 'NOHL' parameter. Conserves storage space and memory by disabling highlighting support. If set, we do not store corresponding byte offsets for term positions.
    */
    nohl?: boolean,
    /**
    *  The 'NOFIELDS' parameter. If set, we do not store field bits for each term.
    */
    noFields?: boolean,
    /**
    *  The 'NOFREQS' parameter.  If set, we avoid saving the term frequencies in the index.
    */
    noFreqs?: boolean,
    /**
    *  The 'SKIPINITIALSCAN' parameter. If set, we do not scan and index. 
    */
    skipInitialScan?: boolean
    /**
    *  The 'PREFIX' parameter. tells the index which keys it should index.
    */
    prefix?: {
        num?: number,
        prefixes: string | string[],
    },
    /**
    * The 'LANGUAGE' parameter.  If set indicates the default language for documents in the index.
    */
    language?: string,
    /**
    * The 'LANGUAGE_FIELD' parameter. If set indicates the document field that should be used as the document language.
    */
    languageField?: string,
    /**
    * The 'SCORE' parameter. If set indicates the default score for documents in the index. 
    */
    score?: string,
    /**
    * The 'SCORE_FIELD' parameter. If set indicates the document field that should be used as the document's rank based on the user's ranking. 
    */
    scoreField?: string
    /**
    * The 'STOPWORDS' parameter. If set, we set the index with a custom stopword list, to be ignored during indexing and search time. 
    */
    stopwords?: {
        num?: number,
        stopwords: string | string[],
    },
}

/**
 * The field parameter
*/
export interface FTFieldOptions {
    /**
    * The 'SORTABLE' parameter. Numeric, tag or text field can have the optional SORTABLE argument that allows the user to later sort the results by the value of this field (this adds memory overhead so do not declare it on large text fields).
    */
    sortable?: boolean,
    /**
    *  The 'NOINDEX' parameter. Fields can have the NOINDEX option, which means they will not be indexed. This is useful in conjunction with SORTABLE , to create fields whose update using PARTIAL will not cause full reindexing of the document. If a field has NOINDEX and doesn't have SORTABLE, it will just be ignored by the index.
    */
    noindex?: boolean,
    /**
    * The 'NOSTEM' parameter. Text fields can have the NOSTEM argument which will disable stemming when indexing its values. This may be ideal for things like proper names.
    */
    nostem?: boolean,
    /**
    *  The 'PHONETIC' parameter. Declaring a text field as PHONETIC will perform phonetic matching on it in searches by default. The obligatory {matcher} argument specifies the phonetic algorithm and language used.
    */
    phonetic?: string,
    /**
    * The 'WEIGHT' parameter. For TEXT fields, declares the importance of this field when calculating result accuracy. This is a multiplication factor, and defaults to 1 if not specified.
    */
    weight?: number,
    /**
    * The 'SEPERATOR' parameter. For TAG fields, indicates how the text contained in the field is to be split into individual tags. The default is , . The value must be a single character.
    */
    seperator?: string
    /**
     * The 'UNF' parameter. By default, SORTABLE applies a normalization to the indexed value (characters set to lowercase, removal of diacritics). When using UNF (un-normalized form) it is possible to disable the normalization and keep the original form of the value. 
     */
    unf?: boolean,
    /**
     * For `TAG` attributes, keeps the original letter cases of the tags. If not specified, the characters are converted to lowercase.
     */
    caseSensitive?: boolean,
}

/**
 * The parameters of the 'FT.CREATE' command, schema fields (Field comming after the 'SCHEMA' command)
*/
export interface FTSchemaField extends FTFieldOptions {
    /**
    * The name of the field
    */
    name: string,
    /**
    * The type of the field
    */
    type: FTFieldType,
    /**
    * The 'AS' parameter. Used when creating an index on 'JSON'.
    */
    as?: string
}

/**
 * The parameter of the 'FT.SEARCH' command
 */
export interface FTSearchParameters {
    /**
    * The 'NOTCONTENT' parameter. If it appears after the query, we only return the document ids and not the content.
    */
    noContent?: boolean,
    /**
    * The 'VERBATIM' parameter. if set, we do not try to use stemming for query expansion but search the query terms verbatim.
    */
    verbatim?: boolean,
    /**
     * The 'noStopWords' parameter. If set, we do not filter stopwords from the query. 
     */
    noStopWords?: boolean,
    /**
     * The 'WITHSCORES' parameter. If set, we also return the relative internal score of each document.
     */
    withScores?: boolean,
    /**
     * The 'WITHPAYLOADS' parameter. If set, we retrieve optional document payloads (see FT.ADD).
    */
    withPayloads?: boolean,
    /**
     * The 'WITHSORTKEYS' parameter. Only relevant in conjunction with SORTBY . Returns the value of the sorting key, right after the id and score and /or payload if requested.
     */
    withSortKeys?: boolean,
    /**
     * The 'FILTER' parameter.  If set, and numeric_field is defined as a numeric field in FT.CREATE, we will limit results to those having numeric values ranging between min and max. min and max follow ZRANGE syntax, and can be -inf , +inf and use ( for exclusive ranges. 
     */
    filter?: {
        /**
         * The numeric_field argument of the 'FILTER' parameter
         */
        field: string,
        /**
         * The min argument of the 'FILTER' parameter
         */
        min: number,
        /**
         * The max argument of the 'FILTER' parameter
         */
        max: number
    }[],
    /**
     * The 'GEOFILTER' parameter. If set, we filter the results to a given radius from lon and lat. Radius is given as a number and units.
     */
    geoFilter?: {
        /**
         * The field of the 'GEOFILTER' parameter
         */
        field: string,
        /**
         * The lon argument of the 'GEOFILTER' parameter
         */
        lon: number,
        /**
         * The lat argument of the 'GEOFILTER' parameter
         */
        lat: number,
        /**
         * The radius argument of the 'GEOFILTER' parameter
         */
        radius: number,
        /**
         * The measurement argument of the 'GEOFILTER' parameter
         */
        measurement: 'm' | 'km' | 'mi' | 'ft'
    },
    /**
     * The 'INKEYS' parameter. If set, we limit the result to a given set of keys specified in the list. the first argument must be the length of the list, and greater than zero.
     */
    inKeys?: {
        num?: number,
        keys?: string | string[],
    },
    /**
     * The 'INFIELDS' parameter. If set, filter the results to ones appearing only in specific fields of the document, like title or URL.
     */
    inFields?: {
        num?: number,
        fields?: string | string[],
    },
    /**
     *  The 'RETURN' parameter. Use this keyword to limit which fields from the document are returned.
     */
    return?: {
        num?: number,
        fields: {
            /**
             * The name of the field.
             */
            field: string,
            /** 
             * The 'AS' parameter following a "field" name, used by index type "JSON".
            */
            as?: string,
        }[],
    },
    /**
     * The 'SUMMARIZE' parameter. Use this option to return only the sections of the field which contain the matched text. 
     */
    summarize?: {
        /**
         * The fields argument of the 'SUMMARIZE' parameter
         */
        fields?: {
            num?: number,
            fields: string | string[],
        },
        /**
         * The fargs argument of the 'SUMMARIZE' parameter
         */
        frags?: number,
        /**
         * The len argument of the 'SUMMARIZE' parameter
         */
        len?: number,
        /**
         * The seperator argument of the 'SUMMARIZE' parameter
         */
        seperator?: string
    },
    /**
     * The 'HIGHLIGHT' parameter. Use this option to format occurrences of matched text.
     */
    highlight?: {
        /**
         * The fields argument of the 'HIGHLIGHT' parameter
         */
        fields?: {
            num?: number,
            fields: string | string[],
        },
        /**
         * The tags argument of the 'HIGHLIGHT' parameter
         */
        tags?: {
            /**
             * The open argument of the tags argument
             */
            open: string,
            /**
             * The close argument of the tags argument
             */
            close: string
        },
    },
    /**
     * The 'SLOP' parameter. If set, we allow a maximum of N intervening number of unmatched offsets between phrase terms.
     */
    slop?: number,
    /**
     * The 'INORDER' parameter. If set, and usually used in conjunction with SLOP, we make sure the query terms appear in the same order in the document as in the query, regardless of the offsets between them. 
     */
    inOrder?: boolean,
    /**
     * The 'LANGUAGE' parameter. If set, we use a stemmer for the supplied language during search for query expansion.
     */
    language?: string,
    /**
     * The 'EXPANDER' parameter. If set, we will use a custom query expander instead of the stemmer.
     */
    expander?: string,
    /**
     * The 'SCORER' parameter. If set, we will use a custom scoring function defined by the user.
     */
    scorer?: string,
    /**
     * The 'EXPLAINSCORE' parameter. If set, will return a textual description of how the scores were calculated.
     */
    explainScore?: boolean,
    /**
     * The 'PAYLOAD' parameter. Add an arbitrary, binary safe payload that will be exposed to custom scoring functions.
     */
    payload?: string,
    /**
     * The 'SORTBY' parameter. If specified, the results are ordered by the value of this field. This applies to both text and numeric fields.
     */
    sortBy?: {
        /**
         * The field argument of the 'SORTBY' parameter
         */
        field: string,
        /**
         * The sort argument of the 'SORTBY' parameter
         */
        sort: FTSort
    },
    /**
     * The 'LIMIT' parameter. If the parameters appear after the query, we limit the results to the offset and number of results given.
     */
    limit?: {
        /**
         * The first argument of the 'LIMIT' parameter
         */
        first: number,
        /**
        * The num argument of the 'LIMIT' parameter
        */
        num: number
    },
    /**
    * If to parse search results to objects or leave them in their array form
    * @default true
    */
    parseSearchQueries?: boolean
}

/**
 * The additional parameter of 'FT.AGGREGATE' command
 */
export interface FTAggregateParameters {
    /**
     * The 'LOAD' parameter. 
     */
    load?: {
        /**
         * The number of arguments
         */
        nargs: string,
        /**
         * The property name
         */
        properties: string[]
    },
    /**
     *  Create new fields using 'APPLY' keyword for aggregations
     */
    apply?: FTExpression[],
    /**
     * The 'GROUPBY' parameter.
     */
    groupby?: {
        /**
         * The number of arguments of the 'GROUPBY' parameter
         */
        nargs: string,
        /**
         * The property name of the 'GROUPBY' parameter
         */
        properties: string[]
    },
    /**
     * The 'REDUCE' parameter.
     */
    reduce?: FTReduce[],
    /**
     * The 'SORTBY' parameter. 
     */
    sortby?: {
        /**
         *  The number of arguments of the 'SORTBY' parameter
         */
        nargs: string,
        /**
         * A list of property names of the 'SORTBY' parameter
         */
        properties: FTSortByProperty[],
        /**
         * The sort type of the 'SORTBY' parameter
         */
        max: number
    },
    /**
     *  Given expressions starting by the 'APPLY' keyword
     */
    expressions?: FTExpression[],
    /**
     * The 'LIMIT' parameter.
     */
    limit?: {
        /**
         * The offset of the 'LIMIT' parameter
         */
        offset: string,
        /**
         * The number of results of the 'LIMIT' parameter
         */
        numberOfResults: number
    },
    /**
     * The expression of the 'FILTER' parameter.
     */
    filter?: string
}

/**
 * The expressions given to the 'APPLY' key word
 */
export interface FTExpression {
    /**
     * The expression given
     */
    expression: string,
    /**
     * The value of 'AS' of the expression determining the name of it.
     */
    as: string
}

/**
 * The 'REDUCE' parameter.
 */
export interface FTReduce {
    /**
     * A function of the 'REDUCE' parameter
     */
    function: string,
    /**
     * The number of arguments of the 'REDUCE' parameter
     */
    nargs: string,
    /**
     * The argument of the 'REDUCE' parameter
     */
    args: string[],
    /**
     * The name of the function of the 'REDUCE' parameter
     */
    as?: string
}

/**
 * The 'SORT BY' property object
 */
export interface FTSortByProperty {
    /**
     * The value of the property
     */
    property: string,
    /**
     * The 'SORT' value of the property
     */
    sort: FTSort
}

/**
 * The available 'SORT' methods
 * @param ASC The ascending sort
 * @param DESC The descending sort
 */
export type FTSort = 'ASC' | 'DESC';

/**
 * The additional parameters of 'FT.SUGADD' command
 */
export interface FTSugAddParameters {
    /**
     * The 'INCR' parameter. if set, we increment the existing entry of the suggestion by the given score, instead of replacing the score. This is useful for updating the dictionary based on user queries in real time
     */
    incr: boolean,
    /**
     * The 'PAYLOAD' parameter. If set, we save an extra payload with the suggestion, that can be fetched by adding the WITHPAYLOADS argument to FT.SUGGET
     */
    payload: string
}

/**
 * The additional parameters of 'FT.SUGGET' command
 */
export interface FTSugGetParameters {
    /**
     * The 'FUZZY' parameter. if set, we do a fuzzy prefix search, including prefixes at Levenshtein distance of 1 from the prefix sent
     */
    fuzzy: boolean,
    /**
     * The 'MAX' parameter. If set, we limit the results to a maximum of num (default: 5).
     */
    max: number,
    /**
     * The 'WITHSCORES' parameter. If set, we also return the score of each suggestion. this can be used to merge results from multiple instances
     */
    withScores: boolean,
    /**
     * The 'WITHPAYLOADS' parameter. If set, we return optional payloads saved along with the suggestions. If no payload is present for an entry, we return a Null Reply.
     */
    withPayloads: boolean
}

/**
 * The additional parameters of 'FT.SPELLCHECK' command
 */
export interface FTSpellCheck {
    /**
     * A list of terms
     */
    terms?: {
        /**
         * The type of the term
         */
        type: 'INCLUDE' | 'EXCLUDE',
        /**
         * The dict of the term
         */
        dict?: string
    }[],
    /**
     * The maximal Levenshtein distance for spelling suggestions (default: 1, max: 4)
     */
    distance?: number | string,
}

/**
 * The available field types
 * @param TEXT The text type
 * @param NUMERIC The number type
 * @param TAG The tag type
 */
export type FTFieldType = 'TEXT' | 'NUMERIC' | 'TAG' | string;

/**
 * The available index types
 * @param HASH The hash index type
 * @param JSON The JSON index type
 */
export type FTIndexType = 'HASH' | 'JSON';

/**
 * The config response
 */
export interface FTConfig {
    EXTLOAD?: string | null,
    SAFEMODE?: string,
    CONCURRENT_WRITE_MODE?: string,
    NOGC?: string,
    MINPREFIX?: string,
    FORKGC_SLEEP_BEFORE_EXIT?: string,
    MAXDOCTABLESIZE?: string,
    MAXSEARCHRESULTS?: string,
    MAXAGGREGATERESULTS?: string,
    MAXEXPANSIONS?: string,
    MAXPREFIXEXPANSIONS?: string,
    TIMEOUT?: string,
    INDEX_THREADS?: string,
    SEARCH_THREADS?: string,
    FRISOINI?: string | null,
    ON_TIMEOUT?: string,
    GCSCANSIZE?: string,
    MIN_PHONETIC_TERM_LEN?: string,
    GC_POLICY?: string,
    FORK_GC_RUN_INTERVAL?: string,
    FORK_GC_CLEAN_THRESHOLD?: string,
    FORK_GC_RETRY_INTERVAL?: string,
    _MAX_RESULTS_TO_UNSORTED_MODE?: string,
    CURSOR_MAX_IDLE?: string,
    NO_MEM_POOLS?: string,
    PARTIAL_INDEXED_DOCS?: string,
    UPGRADE_INDEX?: string
}

/**
 * The info response
 */
export interface FTInfo {
    index_name?: string,
    index_options?: string[],
    index_definition?: {
        key_type?: string,
        prefixes?: string,
        language_field?: string,
        default_score?: string,
        score_field?: string,
        payload_field?: string
    },
    fields?: string[],
    num_docs?: string,
    max_doc_id?: string,
    num_terms?: string,
    num_records?: string,
    inverted_sz_mb?: string,
    total_inverted_index_blocks?: string,
    offset_vectors_sz_mb?: string,
    doc_table_size_mb?: string,
    sortable_values_size_mb?: string,
    key_table_size_mb?: string,
    records_per_doc_avg?: string,
    bytes_per_record_avg?: string,
    offsets_per_term_avg?: string,
    offset_bits_per_record_avg?: string,
    hash_indexing_failures?: string,
    indexing?: string,
    percent_indexed?: string,
    gc_stats?: {
        bytes_collected?: string,
        total_ms_run?: string,
        total_cycles?: string,
        average_cycle_time_ms?: string,
        last_run_time_ms?: string,
        gc_numeric_trees_missed?: string,
        gc_blocks_denied?: string
    },
    cursor_stats?: {
        global_idle?: number,
        global_total?: number,
        index_capacity?: number,
        index_total?: number
    }
}

/**
 * The FT.SPELLCHECK response object
 */
export interface FTSpellCheckResponse {
    /** 
     * The term that was spellchecked
    */
    term: string,
    /**
     *  Suggested corrections
     */
    suggestions: {
        /**
         * Score of the suggestion
         */
        score: string,
        /**
         * Score of the suggestion
         */
        suggestion: string
    }[],
}

/**
 * The response type of the FT search function.
 * The function results in 0 when no results are found, else as an array.
 */
export type FTSearchResponse = number | FTSearchArrayResponse;

/**
 * The response type of the FT search function as an array
 */
export type FTSearchArrayResponse = [number, ...Array<string | string[] | {[key: string]: string}>];