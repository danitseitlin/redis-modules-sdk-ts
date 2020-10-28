import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { ReJSON } from '../modules/rejson';
let client: ReJSON;
const key1 = 'key1';
const key2 = 'key2';
const key3 = 'arrkey';
const path = '.';

describe('RedisJSON Module testing', async function() {
    before(async () => {
        client = new ReJSON({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect()
    })
    after(async () => {
        await client.disconnect();
    })

    it('setCommand function', async () => {
        let response = await client.set(key1, path, '{"x": 1, "str": "yy"}');
        expect(response).to.equal('OK', 'The response of the set command');
        response = await client.set(key2, path, '{"x": 3}');
        expect(response).to.equal('OK', 'The response of the set command');
        response = await client.set(key3, path, '{"items": [1]}');
        expect(response).to.equal('OK', 'The response of the set command');
    });

    it('getCommand function', async () => {
        const response = await client.get(key1, path);
        expect(response).to.equal('{"x":1,"str":"yy"}', 'The response of the get command');
    });
    
    it('mgetCommand function', async () => {
        const response = await client.mget([key1, key2], path);
        expect(response).to.contain('{"x":1,"str":"yy"}', 'The response of the mget command');
        expect(response).to.contain('{"x":3}', 'The response of the mget command');
    });
    
    it('typeCommand function', async () => {
        const response = await client.type(key1, path);
        expect(response).to.equal('object', 'The response of the type command')
    });
    
    it('numincrbyCommand function', async () => {
        const response = await client.numincrby(key1, 2, '.x');
        expect(response).to.equal('3', 'The response of the numincrby command')
    });
    
    it('nummultbyCommand function', async () => {
        const response = await client.nummultby(key1, 3, '.x');
        expect(response).to.equal('9', 'The response of the nummultby command')
    });
    
    it('strappendCommand function', async () => {
        const response = await client.strappend(key1, '"rrr"', '.str');
        expect(response).to.equal(5, 'The response of the strappend command');
        const string = await client.get(key1, '.str');
        expect(string).to.equal('"yyrrr"', 'The response of the get command');
    });
    
    it('strlenCommand function', async () => {
        const response = await client.strlen(key1, '.str')
        expect(response).to.equal(5, 'The response of the strlen command');
    });
    
    it('arrappendCommand function', async () => {
        const response = await client.arrappend(key3, ['3','5','4','2'], '.items');
        expect(response).to.equal(5, 'The response of the arrappend command');
    });
    
    it('arrindexCommand function', async () => {
        const response = await client.arrindex(key3, '1', '.items');
        expect(response).to.equal(0, 'The response of the arrindex command');
    });
    
    it('arrinsertCommand function', async () => {
        const response = await client.arrinsert(key3, 1, '{"z": 5}', '.items');
        expect(response).to.equal(6, 'The response of the arrinsert command');
    });
    
    it('arrlenCommand function', async () => {
        const response = await client.arrlen(key3, '.items');
        expect(response).to.equal(6, 'The response of the arrlen command');
    });
    
    it('arrpopCommand function', async () => {
        const response = await client.arrpop(key3, 0, '.items');
        expect(response).to.equal('1', 'The response of the arrpop command');
    });
    
    it('arrtrimCommand function', async () => {
        const response = await client.arrtrim(key3, 0, 1, '.items');
        expect(response).to.equal(2, 'The response of the arrtrim command');
    });
    
    it('objkeysCommand function', async () => {
        const response = await client.objkeys(key1, path);
        expect(response.toString()).to.equal('x,str', 'The response of the objkeys command');
    });
    
    it('objlenCommand function', async () => {
        const response = await client.objlen(key1, path);
        expect(response).to.equal(2, 'The response of the objlen command');
    });
    
    it('debugCommand function', async () => {
        const response = await client.debug('MEMORY', key1, path);
        expect(response).to.equal(64, 'The response of the debug command');
    });
    
    it('forgetCommand function', async () => {
        const response = await client.forget(key2, path);
        expect(response).to.equal(1, 'The response of the forget command');
    });
    
    it('respCommand function', async () => {
        const response = await client.resp(key1, path)
        expect(response.toString()).to.equal('{,x,9,str,yyrrr', 'The response of the resp command');
    });

    it('delCommand function', async () => {
        const response = await client.del(key1, path);
        expect(response).to.equal(1, 'The response of the del command');
    });
});