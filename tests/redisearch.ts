import { cliArguments } from 'cli-argument-parser'
import { expect } from 'chai'
import { RedisModules } from '../modules/redis-modules'
import { FTParsedSearchResponse, FTSearchArrayResponse } from '../modules/redisearch/redisearch.types'
import * as fs from 'fs';
let redis: RedisModules
const index = 'idx'
const query = '@text:name'
const alias = 'alias'
const sug = {
    key: 'k',
    string: 'str',
    score: 11
}
const dict = {
    name: 'dictX',
    term: 'termY'
}
describe('RediSearch Module testing', async function () {
    before(async () => {
        redis = new RedisModules({
            host: cliArguments.host,
            port: parseInt(cliArguments.port)
        }, { showDebugLogs: true })
        await redis.connect()
    })
    after(async () => {
        await redis.redis.flushdb();
        await redis.disconnect()
    })
    it('create function', async () => {
        let response = await redis.search_module_create(index, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        }])
        expect(response).to.equal('OK', 'The response of the FT.CREATE command')
        response = await redis.search_module_create(`${index}1`, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        }, {
            name: 'name2',
            type: 'TEXT',
            sortable: true,
            weight: 2
        }])
        expect(response).to.equal('OK', 'The response of the FT.CREATE command')
        response = await redis.search_module_create(`${index}-json`, 'JSON', [{
            name: '$.name',
            type: 'TEXT',
            as: 'name'
        }])
        expect(response).to.equal('OK', 'The response of the FT.CREATE command')
        await redis.search_module_dropindex(`${index}1`)
    })
    it('search function on JSON', async () => {
        let response = await redis.search_module_search(index, query)
        expect(response).to.equal(0, 'The response of the FT.SEARCH command')
        //FIXME: JSON Needs more tests, also I couldn't find anything related to `RETURN AS` so that also needs tests
        response = await redis.search_module_search(`${index}-json`, query, {
            return: {
                num: 3,
                fields: [
                    { field: '$.name', as: 'name' }
                ]
            }
        })
        expect(response).to.equal(0, 'The response of the FT.SEARCH command')
        await redis.search_module_dropindex(`${index}-json`)
    })
    it('search function response test (creation phase)', async () => {
        await redis.search_module_create(`${index}-searchtest`, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        }, {
            name: 'age',
            type: 'NUMERIC'
        }, {
            name: 'salary',
            type: 'NUMERIC'
        }, {
            name: 'introduction',
            type: 'TEXT'
        }], {
            prefix: {
                prefixes: ["doc", "alma"]
            }
        })
        await redis.redis.hset(
            'doc:1',
            {
                name: 'John Doe',
                age: 25,
                salary: 2500,
                introduction: 'John Doe is a developer at somekind of company.'
            }
        )
        await redis.redis.hset(
            'doc:2',
            {
                name: 'Jane Doe',
                age: 30,
                salary: 5000,
                introduction: 'Jane Doe is John Doe\'s sister. She is not a developer, she is a hairstylist.'
            }
        )
        await redis.redis.hset(
            'doc:3',
            {
                name: 'Sarah Brown',
                age: 80,
                salary: 10000,
                introduction: 'Sarah Brown is retired with an unusually high "salary".'
            }
        )
    })
    it('Simple search test with field specified in query', async () => {
        const [count, ...result] = await redis.search_module_search(`${index}-searchtest`, '@name:Doe') as FTSearchArrayResponse;
        expect(count).to.equal(2, 'Total number of returining document of FT.SEARCH command')
        expect((result[0] as {[key: string]: string}).key).to.equal('doc:1', 'first document key')
    })
    it('Simple search tests with field specified using inFields', async () => {
        let res = await redis.search_module_search(
            `${index}-searchtest`,
            'Doe',
            {
                inFields: {
                    fields: ['age', 'salary']
                }
            }
        )
        expect(res).to.equal(0, 'Total number of returining document of FT.SEARCH command')
        res = await redis.search_module_search(
            `${index}-searchtest`,
            'Doe',
            {
                inFields: {
                    fields: ['name']
                }
            }
        )
        expect(res[0]).to.equal(2, 'Total number of returining document of FT.SEARCH command')
    })
    it('Search test with inkeys', async () => {
        let res = await redis.search_module_search(
            `${index}-searchtest`,
            'Doe',
            {
                inKeys: {
                    keys: ['doc:1', 'doc:2']
                }
            }
        )
        expect(res[0]).to.equal(2, 'Total number of returining document of FT.SEARCH command')
        res = await redis.search_module_search(
            `${index}-searchtest`,
            'Doe',
            {
                inKeys: {
                    keys: ['doc:3']
                }
            }
        )
        expect(res).to.equal(0, 'Total number of returining document of FT.SEARCH command')
    })
    it('Search tests with filter', async () => {
        let res = await redis.search_module_search(
            `${index}-searchtest`,
            '*',
            {
                filter: [{
                    field: 'age',
                    min: 0,
                    max: 35
                }]
            }
        )
        expect(res[0]).to.equal(2, 'Total number of returining document of FT.SEARCH command')
        res = await redis.search_module_search(
            `${index}-searchtest`,
            '*',
            {
                filter: [
                    {
                        field: 'age',
                        min: 0,
                        max: 35,
                    },
                    {
                        field: 'salary',
                        min: 0,
                        max: 2500,
                    }
                ]
            }
        )
        expect(res[0]).to.equal(1, 'Total number of returining document of FT.SEARCH command')
    })
    it('Search tests with return', async () => {
        let res = await redis.search_module_search(
            `${index}-searchtest`,
            '*',
            {
                return: {
                    fields: [{
                        field: 'age',
                    }]
                }
            }
        )
        expect(res[0]).to.equal(3, 'Total number of returining document of FT.SEARCH command')
        expect(Object.keys(res[1]).length).to.equal(2, 'Total number of returned key-values')
        expect(Object.keys(res[1]).includes('age')).to.equal(true, 'Age must be returned')
        expect(Object.keys(res[1]).includes('salary')).to.equal(false, 'Salary must not be returned')
        expect(Object.keys(res[1]).includes('name')).to.equal(false, 'Name must not be returned')
        expect(Object.keys(res[2]).length).to.equal(2, 'Total number of returned key-values')
        expect(Object.keys(res[3]).length).to.equal(2, 'Total number of returned key-values')
        res = await redis.search_module_search(
            `${index}-searchtest`,
            'Sarah',
            {
                return: {
                    fields: [
                        {
                            field: 'age',
                        },
                        {
                            field: 'salary',
                        }
                    ]
                }
            }
        )
        expect(res[0]).to.equal(1, 'Total number of returining document of FT.SEARCH command')
        expect(Object.keys(res[1]).includes('age')).to.equal(true, 'Age must be returned')
        expect(Object.keys(res[1]).includes('salary')).to.equal(true, 'Salary must be returned')
        expect(Object.keys(res[1]).includes('name')).to.equal(false, 'Name must not be returned')
        res = await redis.search_module_search(
            `${index}-searchtest`,
            '*',
            {
                return: { fields: [] }
            }
        ) as FTSearchArrayResponse;
        expect(res.length).to.equal(4, 'Only keys should be returned (+count of them)')
    })
    it('Search test with summarize', async () => {
        const res = await redis.search_module_search(
            `${index}-searchtest`,
            'De*',
            {
                //! specifying fields in summarize while return is also specified will cause redis (edge version) to crash
                //! Crash in redis image fabe0b38e273
                // return: ['introduction'],
                summarize: {
                    fields: { fields: ['introduction'] },
                    frags: 1,
                    len: 3,
                    separator: ' !?!'
                }
            }
        )
        expect(res[0]).to.equal(2, 'Total number of returining document of FT.SEARCH command')
        expect((res[1] as {[key: string]: string}).introduction.endsWith('!?!')).to.equal(true, 'Custom summarize separator')
        expect((res[1] as {[key: string]: string}).introduction.endsWith('!?!')).to.equal(true, 'Custom summarize separator')
    })
    it('Search tests with highlight', async () => {
        const res = await redis.search_module_search(
            `${index}-searchtest`,
            'Do*|De*',
            {
                highlight: {
                    fields: { fields: ['introduction'] },
                    tags: {
                        open: '**',
                        close: '**'
                    }
                }
            }
        )
        expect(res[0]).to.equal(2, 'Total number of returining document of FT.SEARCH command')
        expect((res[1] as {[key: string]: string}).name.includes('**')).to.equal(false, 'Name mustn\'t be highlighted')
        expect((res[1] as {[key: string]: string}).introduction.includes('**developer**')).to.equal(true, 'Introduction must be highlighted')
    })
    it('Search test with sortby ', async () => {
        const res = await redis.search_module_search(
            `${index}-searchtest`,
            '*',
            {
                return: { fields: [{ field: 'age' }] },
                sortBy: {
                    field: 'age',
                    sort: 'ASC'
                }
            }
        )
        expect(res[0]).to.equal(3, 'Total number of returining document of FT.SEARCH command')
        expect((res[1] as {[key: string]: string}).age).to.equal('25', 'Ages should be returned in ascending order')
        expect((res[2] as {[key: string]: string}).age).to.equal('30', 'Ages should be returned in ascending order')
        expect((res[3] as {[key: string]: string}).age).to.equal('80', 'Ages should be returned in ascending order')
    })
    it('Search test with limit', async () => {
        const res = await redis.search_module_search(
            `${index}-searchtest`,
            '*',
            {
                limit: {
                    first: 0,
                    num: 1
                }
            }
        ) as FTSearchArrayResponse;
        expect(res[0]).to.equal(3, 'Total number of returining document of FT.SEARCH command')
        expect(res.length).to.equal(2, 'Only one item should be returned')
    })
    it('aggregate function', async () => {
        const response = await redis.search_module_aggregate(index, query)
        expect(response.numberOfItems).to.equal(0, 'The response of the FT.AGGREGATE command')
    })
    it('aggregate function response', async () => {
        await redis.search_module_create(`${index}-aggreagtetest`, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        },
        {
            name: 'city',
            type: 'TEXT'
        },
        {
            name: 'gender',
            type: 'TAG'
        },
        {
            name: 'timestamp',
            type: 'NUMERIC',
            sortable: true
        }
        ], {
            prefix: {prefixes: ['person']}
        })

        const time = new Date()

        await redis.redis.hset('person:1', { name: 'John Doe', city: 'London', gender: 'male', timestamp: (time.getTime() / 1000).toFixed(0) })
        await redis.redis.hset('person:2', { name: 'Jane Doe', city: 'London', gender: 'female', timestamp: (time.getTime() / 1000).toFixed(0) })

        time.setHours(time.getHours() - 3)

        await redis.redis.hset('person:3', { name: 'Sarah Brown', city: 'New York', gender: 'female', timestamp: (time.getTime() / 1000).toFixed(0) })
        await redis.redis.hset('person:3', { name: 'Michael Doe', city: 'New York', gender: 'male', timestamp: (time.getTime() / 1000).toFixed(0) })

        let response = await redis.search_module_aggregate(`${index}-aggreagtetest`, 'Doe', {
            groupby: { properties: ['@city'], nargs: '1' }
        })
        expect(response.numberOfItems).to.equal(2, 'Total number of the FT.AGGREGATE command result')
        expect(response.items[0].name).to.equal('city', 'Aggreagated prop of the FT.AGGREGATE command result')

        response = await redis.search_module_aggregate(`${index}-aggreagtetest`, '*', {
            apply: [{ expression: 'hour(@timestamp)', as: 'hour' }],
            groupby: { properties: ['@hour'], nargs: '1' }
        })
        expect(response.numberOfItems).to.equal(2, 'Total number of the FT.AGGREGATE command result')
        expect(response.items[0].name).to.equal('hour', 'Aggreagated apply prop of the FT.AGGREGATE command result')

        await redis.search_module_dropindex(`${index}-aggreagtetest`)
    })
    it('explain function', async () => {
        const response = await redis.search_module_explain(index, query)
        expect(response).to.contain('@NULL:UNION', 'The response of the FT.EXPLAIN command')
    })
    it('explainCLI function', async () => {
        const response = await redis.search_module_explainCLI(index, query)
        expect(response).to.equal('@NULL:UNION {  @NULL:name  @NULL:+name(expanded)}', 'The response of the FT.EXPLAINCLI command')
    })
    it('alter function', async () => {
        const response = await redis.search_module_alter(index, 'tags', 'TAG')
        expect(response).to.equal('OK', 'The response of the FT.ALTER command')
    })
    it('aliasadd function', async () => {
        const response = await redis.search_module_aliasadd(alias, index)
        expect(response).to.equal('OK', 'The response of the FT.ALIASADD command')
    })
    it('aliasupdate function', async () => {
        const response = await redis.search_module_aliasupdate(alias, index)
        expect(response).to.equal('OK', 'The response of the FT.ALIASUPDATE command')
    })
    it('aliasdel function', async () => {
        const response = await redis.search_module_aliasdel(alias)
        expect(response).to.equal('OK', 'The response of the FT.ALIASDEL command')
    })
    it('sugadd function', async () => {
        const response = await redis.search_module_sugadd(sug.key, sug.string, sug.score)
        expect(response).to.equal(1, 'The response of the FT.SUGADD command')
    })
    it('sugget function', async () => {
        const response = await redis.search_module_sugget(sug.key, sug.string)
        expect(response).to.equal('str', 'The response of the FT.SUGGET command')
    })
    it('suglen function', async () => {
        const response = await redis.search_module_suglen(sug.key)
        expect(response).to.equal(1, 'The response of the FT.SUGLEN command')
    })
    it('sugdel function', async () => {
        const response = await redis.search_module_sugdel(sug.key, sug.string)
        expect(response).to.equal(1, 'The response of the FT.SUGDEL command')
    })
    it('tagvalgs function', async () => {
        const response = await redis.search_module_tagvals(index, 'tags')
        expect(response.length).to.equal(0, 'The response of the FT.TAGVALS command')
    })
    it('synupdate function', async () => {
        const response = await redis.search_module_synupdate(index, 0, ['term1'])
        expect(response).to.equal('OK', 'The response of the FT.SYNUPDATE command')
    })
    it('syndump function', async () => {
        const response = await redis.search_module_syndump(index)
        expect(response.term1).to.equal('0', 'The response of the FT.SYNDUMP command')
    })
    it('spellcheck function', async () => {
        await redis.search_module_create(`${index}-spellcheck`, 'HASH', [{
            name: "content",
            type: "TEXT",
        }], {
            prefix: { prefixes: 'colors:' }
        });
        await redis.redis.hset('colors:1', { content: 'red green blue yellow mellon' })

        let response = await redis.search_module_spellcheck(`${index}-spellcheck`, "redis")
        expect(response[0].suggestions.length).to.equal(0, 'No suggestion should be found')

        response = await redis.search_module_spellcheck(`${index}-spellcheck`, "mellow blua")
        expect(response.length).to.equal(2, 'Both word should be spellchecked')
    })
    it('dictadd function', async () => {
        const response = await redis.search_module_dictadd(dict.name, [dict.term])
        expect(response).to.equal(1, 'The response of the FT.DICTADD command')
    })
    it('dictdel function', async () => {
        await redis.search_module_dictadd(dict.name, [dict.term])
        const response = await redis.search_module_dictdel(dict.name, [dict.term])
        expect(response).to.equal(1, 'The response of the FT.DICDEL command')
    })
    it('dictdump function', async () => {
        await redis.search_module_dictadd(`${dict.name}1`, [`${dict.term}1`])
        const response = await redis.search_module_dictdump(`${dict.name}1`)
        expect(response).to.equal('termY1', 'The response of the FT.DICTDUMP command')
        await redis.search_module_dictdel(`${dict.name}1`, [`${dict.term}1`])
    })
    it('info function', async () => {
        const response = await redis.search_module_info(index)
        expect(response.index_name).to.equal(index, 'The index name')
    })
    it('config function', async () => {
        const response = await redis.search_module_config('GET', '*')
        expect(response.EXTLOAD).to.equal(null, 'The EXTLOAD value')
    })
    it('dropindex function', async () => {
        await redis.search_module_create(`${index}-droptest`, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        }])
        const response = await redis.search_module_dropindex(`${index}-droptest`)
        expect(response).to.equal('OK', 'The response of the FT.DROPINDEX command')
    })
    it('Testing the parse of search function as JSON', async () => {
        const json = fs.readFileSync('tests/data/models/sample1.json', { encoding: 'utf-8'});
        const parsedJSON = JSON.parse(json);
        await redis.search_module_create('li-index', 'JSON', [{
            name: '$.title',
            type: 'TEXT',
        }, {
            name: '$.description',
            type: 'TEXT',
        }]);

        await Promise.all(parsedJSON.map(async (p: { id: number; }) => await redis.rejson_module_set(`li:${p.id}`, '$', JSON.stringify(p))));
        const result = await redis.search_module_search('li-index', 'KAS', { limit: { first: 0, num: 20 }, withScores: true }) as FTParsedSearchResponse;
        const { resultsCount } = result;
        expect(resultsCount).to.equal(1, 'The count of the results');
    })
})