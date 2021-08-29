import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Redisearch } from '../modules/redisearch';
import { Redis } from '../modules/redis';
let client: Redisearch;
let redis: Redis;
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
        client = new Redisearch({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        redis = new Redis({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
        await redis.connect();
    })
    after(async () => {
        await client.disconnect();
        await redis.disconnect();
    })
    /* it('create function', async () => {
        let response = await client.create(index, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        }])
        expect(response).to.equal('OK', 'The response of the FT.CREATE command');
        response = await client.create(`${index}1`, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        }, {
            name: 'name2',
            type: 'TEXT',
            sortable: true,
            weight: 2
        }])
        expect(response).to.equal('OK', 'The response of the FT.CREATE command');
        response = await client.create(`${index}-json`, 'JSON', [{
            name: '$.name',
            type: 'TEXT',
            as: 'name'
        }])
        expect(response).to.equal('OK', 'The response of the FT.CREATE command');
    });
    it('search function', async () => {
        let response = await client.search(index, query)
        expect(response).to.equal(0, 'The response of the FT.SEARCH command')
        response = await client.search(index, query, {
            return: {
                num: 3,
                fields: [{
                    name: '$.name',
                    as: 'name'
                }]
            }
        })
        expect(response).to.equal(0, 'The response of the FT.SEARCH command')
    }); */
    it('search function response test', async () => {
        await client.create(`${index}-searchtest`, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        }, {
            name: 'age',
            type: 'NUMERIC'
        }, {
            name: 'salary',
            type: 'NUMERIC'
        }], {
            prefix: [
                {
                    count: 1,
                    name: 'doc'
                }
            ]
        })
        await client.redis.hset('doc:1', { name: 'John Doe', age: 25, salary: 2500 });
        await client.redis.hset('doc:2', { name: 'Jane Doe', age: 30, salary: 5000 });
        await client.redis.hset('doc:3', { name: 'Sarah Brown', age: 80, salary: 10000 });
        try {
            //Simple search test with field specified in query
            let [count, ...result] = await client.search(`${index}-searchtest`, '@name:Doe');
            expect(count).to.equal(2, 'Total number of returining document of FT.SEARCH command');
            expect(result[0].indexOf('doc')).to.equal(0, 'first document key');

            //Simple search tests with field specified using inFields
            let res = await client.search(
                `${index}-searchtest`,
                'Doe',
                {
                    inFields:
                        ["age"],
                },
            );
            expect(res).to.equal(0, 'Total number of returining document of FT.SEARCH command');
            res = await client.search(
                `${index}-searchtest`,
                'Doe',
                {
                    inFields:
                        ["name"],
                },
            );
            expect(res[0]).to.equal(2, 'Total number of returining document of FT.SEARCH command');

            //Search test with inkeys
            res = await client.search(
                `${index}-searchtest`,
                'Doe',
                {
                    inKeys:
                        ["doc:1", "doc:2"],
                },
            );
            expect(res[0]).to.equal(2, 'Total number of returining document of FT.SEARCH command');
            res = await client.search(
                `${index}-searchtest`,
                'Doe',
                {
                    inKeys:
                        ["doc:3"],
                },
            );
            expect(res).to.equal(0, 'Total number of returining document of FT.SEARCH command');

            //Search tests with filter
            res = await client.search(
                `${index}-searchtest`,
                '*',
                {
                    filter: [{
                        field: "age",
                        min: 0,
                        max: 35,
                    }],
                },
            );
            expect(res[0]).to.equal(2, 'Total number of returining document of FT.SEARCH command');
            res = await client.search(
                `${index}-searchtest`,
                '*',
                {
                    filter: [
                        {
                            field: "age",
                            min: 0,
                            max: 35,
                        },
                        {
                            field: "salary",
                            min: 0,
                            max: 2500,
                        },
                    ],
                },
            );
            expect(res[0]).to.equal(1, 'Total number of returining document of FT.SEARCH command');

            //Search tests with return
            res = await client.search(
                `${index}-searchtest`,
                '*',
                {
                    return: [
                        "age",
                    ],
                },
            );
            expect(res[0]).to.equal(3, 'Total number of returining document of FT.SEARCH command');
            expect(res[2].length).to.equal(2, 'Total number of returned key-values');
            expect(res[2].includes("age")).to.equal(true, 'Age must be returned');
            expect(res[2].includes("salary")).to.equal(false, 'Salary must not be returned');
            expect(res[2].includes("name")).to.equal(false, 'Name must not be returned');
            expect(res[4].length).to.equal(2, 'Total number of returned key-values');
            expect(res[6].length).to.equal(2, 'Total number of returned key-values');
            res = await client.search(
                `${index}-searchtest`,
                'Sarah',
                {
                    return: [
                        "age", "salary"
                    ],
                },
            );
            expect(res[0]).to.equal(1, 'Total number of returining document of FT.SEARCH command');
            expect(res[2].includes("age")).to.equal(true, 'Age must be returned');
            expect(res[2].includes("salary")).to.equal(true, 'Salary must be returned');
            expect(res[2].includes("name")).to.equal(false, 'Name must not be returned');
        } finally {
            await client.dropindex(`${index}-searchtest`);
        }
    });
    /* it('aggregate function', async () => {
        const response = await client.aggregate(index, query)
        expect(response).to.equal(0, 'The response of the FT.AGGREGATE command')
    });
    it('aggregate function response', async () => {
        await client.create(`${index}-aggreagtetest`, 'HASH', [{
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
            prefix: [
                {
                    count: 1,
                    name: 'person'
                }
            ]
        });

        const time = new Date();

        await client.redis.hset('person:1', { name: 'John Doe', city: 'London', gender: 'male', timestamp: (time.getTime() / 1000).toFixed(0) });
        await client.redis.hset('person:2', { name: 'Jane Doe', city: 'London', gender: 'female', timestamp: (time.getTime() / 1000).toFixed(0) });

        time.setHours(time.getHours() - 3);

        await client.redis.hset('person:3', { name: 'Sarah Brown', city: 'New York', gender: 'female', timestamp: (time.getTime() / 1000).toFixed(0) });
        await client.redis.hset('person:3', { name: 'Michael Doe', city: 'New York', gender: 'male', timestamp: (time.getTime() / 1000).toFixed(0) });

        const [count, ...result] = await client.aggregate(`${index}-aggreagtetest`, 'Doe', {
            groupby: { properties: ['@city'], nargs: '1' }
        });
        expect(count).to.equal(2, 'Total number of the FT.AGGREGATE command result');
        expect(result[0][0]).to.equal('city', 'Aggreagated prop of the FT.AGGREGATE command result');

        const [count2, ...results2] = await client.aggregate(`${index}-aggreagtetest`, '*', {
            apply: [ { expression: 'hour(@timestamp)', as: 'hour' } ],
            groupby: { properties: ['@hour'], nargs: '1'}
        })
        expect(count2).to.equal(2, 'Total number of the FT.AGGREGATE command result');
        expect(results2[0][0]).to.equal('hour', 'Aggreagated apply prop of the FT.AGGREGATE command result');

        await client.dropindex(`${index}-aggreagtetest`);
    });
    it('explain function', async () => {
        const response = await client.explain(index, query)
        expect(response).to.contain('@NULL:UNION', 'The response of the FT.EXPLAIN command')
    });
    it('explainCLI function', async () => {
        const response = await client.explainCLI(index, query);
        expect(response).to.equal('@NULL:UNION {  @NULL:name  @NULL:+name(expanded)}', 'The response of the FT.EXPLAINCLI command');
    });
    it('alter function', async () => {
        const response = await client.alter(index, 'tags', 'TAG')
        expect(response).to.equal('OK', 'The response of the FT.ALTER command');
    });
    it('aliasadd function', async () => {
        const response = await client.aliasadd(alias, index)
        expect(response).to.equal('OK', 'The response of the FT.ALIASADD command');
    });
    it('aliasupdate function', async () => {
        const response = await client.aliasupdate(alias, index)
        expect(response).to.equal('OK', 'The response of the FT.ALIASUPDATE command');
    });
    it('aliasdel function', async () => {
        const response = await client.aliasdel(alias)
        expect(response).to.equal('OK', 'The response of the FT.ALIASDEL command');
    });
    it('sugadd function', async () => {
        const response = await client.sugadd(sug.key, sug.string, sug.score);
        expect(response).to.equal(1, 'The response of the FT.SUGADD command');
    });
    it('sugget function', async () => {
        const response = await client.sugget(sug.key, sug.string)
        expect(response).to.equal('str', 'The response of the FT.SUGGET command');
    });
    it('suglen function', async () => {
        const response = await client.suglen(sug.key)
        expect(response).to.equal(1, 'The response of the FT.SUGLEN command');
    });
    it('sugdel function', async () => {
        const response = await client.sugdel(sug.key, sug.string)
        expect(response).to.equal(1, 'The response of the FT.SUGDEL command');
    });
    it('tagvalgs function', async () => {
        const response = await client.tagvals(index, 'tags')
        expect(response.length).to.equal(0, 'The response of the FT.TAGVALS command')
    });
    it('synupdate function', async () => {
        const response = await client.synupdate(index, 0, ['term1'])
        expect(response).to.equal('OK', 'The response of the FT.SYNUPDATE command');
    });
    it('syndump function', async () => {
        const response = await client.syndump(index)
        expect(response.term1).to.equal('0', 'The response of the FT.SYNDUMP command');
    });
    it('spellcheck function', async () => {
        const response = await client.spellcheck(index, query);
        expect(response.length).to.be.greaterThan(0, 'The response of the FT.SPELLCHECK command')
    });
    it('dictadd function', async () => {
        const response = await client.dictadd(dict.name, [dict.term]);
        expect(response).to.equal(1, 'The response of the FT.DICTADD command');
    });
    it('dictdel function', async () => {
        await client.dictadd(dict.name, [dict.term]);
        const response = await client.dictdel(dict.name, [dict.term]);
        expect(response).to.equal(1, 'The response of the FT.DICDEL command');
    });
    it('dictdump function', async () => {
        await client.dictadd(`${dict.name}1`, [`${dict.term}1`]);
        const response = await client.dictdump(`${dict.name}1`);
        expect(response).to.equal('termY1', 'The response of the FT.DICTDUMP command');
        await client.dictdel(`${dict.name}1`, [`${dict.term}1`]);
    });
    it('info function', async () => {
        const response = await client.info(index)
        expect(response.index_name).to.equal(index, 'The index name'); 
    });
    it('config function', async () => {
        const response = await client.config('GET', '*')
        expect(response.EXTLOAD).to.equal(null, 'The EXTLOAD value');
    });
    it('dropindex function', async () => {
        await client.create(`${index}-droptest`, 'HASH', [{
            name: 'name',
            type: 'TEXT'
        }])
        const response = await client.dropindex(`${index}-droptest`)
        expect(response).to.equal('OK', 'The response of the FT.DROPINDEX command');
    }); */
});