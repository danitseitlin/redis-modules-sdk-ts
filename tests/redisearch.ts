import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RediSearch } from '../modules/redisearch';
let client: RediSearch;
let index = 'idx'
let query = '@text:morphix=>{$phonetic:false}'
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
    /*it('hset function', async () => {
        const response = await client.hset('hash', {
            'field1': 'value1'
        })
        console.log(response)
    });
    it('hsetnx function', async () => {
        const response = await client.hsetnx('hash', {
            'field1': 'value1'
        })
        console.log(response)
    });
    
    it('hincrby function', async () => {
        const response = await client.hincrby()
        console.log(response)
    });
    it('hdecrby function', async () => {
        const response = await client.hdecrby()
        console.log(response)
    });
    it('hdel function', async () => {
        const response = await client.hdel()
        console.log(response)
    });*/
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
            filter: ''
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
    /*it('alter function', async () => {
        const response = await client.alter()
        console.log(response)
    });
    it('dropindex function', async () => {
        const response = await client.dropindex()
        console.log(response)
    });
    it('aliasadd function', async () => {
        const response = await client.aliasadd()
        console.log(response)
    });
    it('aliasupdate function', async () => {
        const response = await client.aliasupdate()
        console.log(response)
    });
    it('aliasdel function', async () => {
        const response = await client.aliasdel()
        console.log(response)
    });
    it('tagvalgs function', async () => {
        const response = await client.tagvalgs()
        console.log(response)
    });
    it('sugadd function', async () => {
        const response = await client.sugadd()
        console.log(response)
    });
    it('sugget function', async () => {
        const response = await client.sugget()
        console.log(response)
    });
    it('sugdel function', async () => {
        const response = await client.sugdel()
        console.log(response)
    });
    it('suglen function', async () => {
        const response = await client.suglen()
        console.log(response)
    });
    it('synupdate function', async () => {
        const response = await client.synupdate()
        console.log(response)
    });
    it('syndump function', async () => {
        const response = await client.syndump()
        console.log(response)
    });
    it('spellcheck function', async () => {
        const response = await client.spellcheck()
        console.log(response)
    });
    it('dictadd function', async () => {
        const response = await client.dictadd()
        console.log(response)
    });
    it('dictdel function', async () => {
        const response = await client.dictdel()
        console.log(response)
    });
    it('dictdump function', async () => {
        const response = await client.dictdump()
        console.log(response)
    });
    it('info function', async () => {
        const response = await client.info()
        console.log(response)
    });
    it('config function', async () => {
        const response = await client.config()
        console.log(response)
    });*/
});