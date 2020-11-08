import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Redisearch } from '../modules/redisearch';
let client: Redisearch;
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
        expect(response).to.equal('OK', 'The response of the FT.CREATE command');
    });
    it('search function', async () => {
        const response = await client.search(index, query)
        expect(response[0]).to.equal(0, 'The response of the FT.SEARCH command')
    });
    it('aggregate function', async () => {
        const response = await client.aggregate(index, query)
        expect(response[0]).to.equal(0, 'The response of the FT.SEARCH command')
    });
    it('explain function', async () => {
        const response = await client.explain(index, query)
        expect(response).to.contain('@NULL:UNION', 'The response of the FT.EXPLAIN command')
    });
    it('explainCLI function', async () => {
        const response = (await client.explainCLI(index, query)).join('');
        expect(response).to.equal('@NULL:UNION {  @NULL:name  @NULL:+name(expanded)}', 'The response of the FT.EXPLAINCLI command');
    });
    it('alter function', async () => {
        const response = await client.alter(index, 'name', 'TEXT')
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
        expect(response[0]).to.equal('str', 'The response of the FT.SUGGET command');
    });
    it('suglen function', async () => {
        const response = await client.suglen(sug.key)
        expect(response).to.equal(1, 'The response of the FT.SUGLEN command');
    });
    it('sugdel function', async () => {
        const response = await client.sugdel(sug.key, sug.string)
        expect(response).to.equal(1, 'The response of the FT.SUGDEL command');
    });
    it.skip('tagvalgs function', async () => {
        const response = await client.tagvals(index, sug.key)
        console.log(response)
    });
    it('synupdate function', async () => {
        const response = await client.synupdate(index, 0, ['term1'])
        expect(response).to.equal('OK', 'The response of the FT.SYNUPDATE command');
    });
    it('syndump function', async () => {
        const response = await client.syndump(index)
        expect(response[0]).to.equal('term1', 'The response of the FT.SYNDUMP command');
    });
    it('spellcheck function', async () => {
        const response = await client.spellcheck(index, query);

        expect(response[0].length).to.be.greaterThan(0, 'The response of the FT.SPELLCHECK command')
    });
    it('dictadd function', async () => {
        let response = await client.dictadd(dict.name, [dict.term])
        expect(response).to.equal(1, 'The response of the FT.DICTADD command');
        response = await client.dictadd(`${dict.name}1`, [dict.term+'1'])
        expect(response).to.equal(1, 'The response of the FT.DICTADD command');
    });
    it('dictdel function', async () => {
        const response = await client.dictdel(dict.name, [dict.term])
        expect(response).to.equal(1, 'The response of the FT.DICDEL command');
    });
    it('dictdump function', async () => {
        const response = await client.dictdump(`${dict.name}1`)
        expect(response[0]).to.equal('termY1', 'The response of the FT.DICTDUMP command');
    });
    it('info function', async () => {
        const response = await client.info(index)
        expect(response[0]).to.equal('index_name', 'The index name field');
        expect(response[1]).to.equal(index, 'The index name'); 
    });
    it('config function', async () => {
        const response = await client.config('GET', '*')
        expect(response[0][0]).to.equal('EXTLOAD', 'The EXTLOAD key');
        expect(response[0][1]).to.equal(null, 'The EXTLOAD value');
    });
    it('dropindex function', async () => {
        const response = await client.dropindex(index)
        expect(response).to.equal('OK', 'The response of the FT.DROPINDEX command');
    });
});