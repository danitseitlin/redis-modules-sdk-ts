import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RediSearch } from '../modules/redisearch';
let client: RediSearch;
let index = 'idx'
let query = '@text:name'
let alias = 'alias'
let sug = {
    key: 'k',
    string: 'str',
    score: 11
}
let dict = {
    name: 'dictX',
    term: 'termY'
}
describe('RediSearch Module testing', async function() {
    before(async () => {
        client = new RediSearch({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('create function', async () => {
        const response = await client.create({
            index: index,
            on: 'HASH'
        }, [{
            name: 'name',
            type: 'TEXT'
        }])
        console.log(response)
    });
    it('search function', async () => {
        const response = await client.search({
            index: index,
            query: query
        })
        console.log(response)
    });
    it('aggregate function', async () => {
        const response = await client.aggregate({
            indexName: index,
            query: query,
        })
        console.log(response)
    });
    it('explain function', async () => {
        const response = await client.explain(index, query)
        console.log(response)
    });
    it('explainCLI function', async () => {
        const response = await client.explainCLI(index, query)
        console.log(response)
    });
    it('alter function', async () => {
        const response = await client.alter(index, 'name', {
            sortable: true
        })
        console.log(response)
    });
    
    it('aliasadd function', async () => {
        const response = await client.aliasadd(alias, index)
        console.log(response)
    });
    it('aliasupdate function', async () => {
        const response = await client.aliasupdate(alias, index)
        console.log(response)
    });
    it('aliasdel function', async () => {
        const response = await client.aliasdel(alias)
        console.log(response)
    });
    
    it('sugadd function', async () => {
        const response = await client.sugadd(sug.key, sug.string, sug.score);
        console.log(response)
    });
    it('sugget function', async () => {
        const response = await client.sugget(sug.key, sug.string)
        console.log(response)
    });
    it('suglen function', async () => {
        const response = await client.suglen(sug.key)
        console.log(response)
    });
    it('sugdel function', async () => {
        const response = await client.sugdel(sug.key, sug.string)
        console.log(response)
    });
    it('tagvalgs function', async () => {
        const response = await client.tagvals(index, sug.key)
        console.log(response)
    });
    it('synupdate function', async () => {
        const response = await client.synupdate(index, 0, ['term1'])
        console.log(response)
    });
    it('syndump function', async () => {
        const response = await client.syndump(index)
        console.log(response)
    });
    /*it('spellcheck function', async () => {
        const response = await client.spellcheck()
        console.log(response)
    });*/
    it('dictadd function', async () => {
        let response = await client.dictadd(dict.name, [dict.term])
        console.log(response)
        response = await client.dictadd(`${dict.name}1`, [dict.term+'1'])
        console.log(response)
    });
    it('dictdel function', async () => {
        const response = await client.dictdel(dict.name, [dict.term])
        console.log(response)
    });
    it('dictdump function', async () => {
        const response = await client.dictdump(`${dict.name}1`)
        console.log(response)
    });*/
    it('info function', async () => {
        const response = await client.info(index)
        console.log(response)
    });
    it('config function', async () => {
        const response = await client.config('GET', '*')
        console.log(response)
    });
    it('dropindex function', async () => {
        const response = await client.dropindex(index)
        console.log(response)
    });
});