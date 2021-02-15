import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Redisearch } from '../modules/redisearch';
let client: Redisearch;
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
describe('RediSearch Module testing', async function() {
    before(async () => {
        client = new Redisearch({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('create function', async () => {
        const response = await client.create(index, [{
            name: 'name',
            type: 'TEXT'
        }])
        console.log(response)
        expect(response).to.equal('OK', 'The response of the FT.CREATE command');
    });
    it('search function', async () => {
        const response = await client.search(index, query)
        console.log(response)
        expect(response).to.equal(0, 'The response of the FT.SEARCH command')
    });
    it('aggregate function', async () => {
        const response = await client.aggregate(index, query)
        console.log(response)
        expect(response).to.equal(0, 'The response of the FT.SEARCH command')
    });
    it('explain function', async () => {
        const response = await client.explain(index, query)
        expect(response).to.contain('@NULL:UNION', 'The response of the FT.EXPLAIN command')
    });
    it('explainCLI function', async () => {
        console.log(await client.explainCLI(index, query))
        const response = await client.explainCLI(index, query);
        expect(response).to.equal('@NULL:UNION {  @NULL:name  @NULL:+name(expanded)}', 'The response of the FT.EXPLAINCLI command');
    });
    it('alter function', async () => {
        const response = await client.alter(index, 'tags', 'TAG')
        console.log(response)
        expect(response).to.equal('OK', 'The response of the FT.ALTER command');
    });
    
    it('aliasadd function', async () => {
        const response = await client.aliasadd(alias, index)
        console.log(response)
        expect(response).to.equal('OK', 'The response of the FT.ALIASADD command');
    });
    it('aliasupdate function', async () => {
        const response = await client.aliasupdate(alias, index)
        console.log(response)
        expect(response).to.equal('OK', 'The response of the FT.ALIASUPDATE command');
    });
    it('aliasdel function', async () => {
        const response = await client.aliasdel(alias)
        console.log(response)
        expect(response).to.equal('OK', 'The response of the FT.ALIASDEL command');
    });
    
    it('sugadd function', async () => {
        const response = await client.sugadd(sug.key, sug.string, sug.score);
        console.log(response)
        expect(response).to.equal(1, 'The response of the FT.SUGADD command');
    });
    it('sugget function', async () => {
        const response = await client.sugget(sug.key, sug.string)
        console.log(response)
        expect(response).to.equal('str', 'The response of the FT.SUGGET command');
    });
    it('suglen function', async () => {
        const response = await client.suglen(sug.key)
        console.log(response)
        expect(response).to.equal(1, 'The response of the FT.SUGLEN command');
    });
    it('sugdel function', async () => {
        const response = await client.sugdel(sug.key, sug.string)
        console.log(response)
        expect(response).to.equal(1, 'The response of the FT.SUGDEL command');
    });
    it('tagvalgs function', async () => {
        const response = await client.tagvals(index, 'tags')
        console.log(response)
        expect(response.length).to.equal(0, 'The response of the FT.TAGVALS command')
    });
    it('synupdate function', async () => {
        const response = await client.synupdate(index, 0, ['term1'])
        console.log(response)
        expect(response).to.equal('OK', 'The response of the FT.SYNUPDATE command');
    });
    it('syndump function', async () => {
        const response = await client.syndump(index)
        console.log(response)
        expect(response.term1).to.equal('0', 'The response of the FT.SYNDUMP command');
    });
    it('spellcheck function', async () => {
        const response = await client.spellcheck(index, query);
        console.log(response)
        expect(response).to.be.greaterThan(0, 'The response of the FT.SPELLCHECK command')
    });
    it('dictadd function', async () => {
        let response = await client.dictadd(dict.name, [dict.term])
        console.log(response)
        expect(response).to.equal(1, 'The response of the FT.DICTADD command');
        response = await client.dictadd(`${dict.name}1`, [dict.term+'1'])
        console.log(response)
        expect(response).to.equal(1, 'The response of the FT.DICTADD command');
    });
    it('dictdel function', async () => {
        const response = await client.dictdel(dict.name, [dict.term])
        console.log(response)
        expect(response).to.equal(1, 'The response of the FT.DICDEL command');
    });
    it('dictdump function', async () => {
        const response = await client.dictdump(`${dict.name}1`)
        console.log(response)
        expect(response).to.equal('termY1', 'The response of the FT.DICTDUMP command');
    });
    it('info function', async () => {
        const response = await client.info(index)
        console.log(response)
        expect(response.index_name).to.equal(index, 'The index name'); 
    });
    it('config function', async () => {
        const response = await client.config('GET', '*')
        console.log(response)
        expect(response.EXTLOAD).to.equal(null, 'The EXTLOAD value');
    });
    it('dropindex function', async () => {
        const response = await client.dropindex(index)
        console.log(response)
        expect(response).to.equal('OK', 'The response of the FT.DROPINDEX command');
    });
});