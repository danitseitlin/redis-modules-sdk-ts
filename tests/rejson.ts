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
    })
    after(async () => {
        await client.quit();
    })

    it('setCommand function', async () => {
        let response = await client.setCommand(key1, path, '{"x": 1, "str": "yy"}');
        expect(response).to.equal('OK', 'The response of the set command');
        response = await client.setCommand(key2, path, '{"x": 3}');
        expect(response).to.equal('OK', 'The response of the set command');
        response = await client.setCommand(key3, path, '{"items": [1]}');
        expect(response).to.equal('OK', 'The response of the set command');
    });

    it('getCommand function', async () => {
        const response = await client.getCommand(key1, path);
        expect(response).to.equal('{"x":1,"str":"yy"}', 'The response of the get command');
    });

    
    it('mgetCommand function', async () => {
        const response = await client.mgetCommand([key1, key2], path);
        expect(response).to.equal('[ \'{"x":1,"str":"yy"}\', \'{"x":3}\' ]', 'The response of the mget command');
    });
    
    it('typeCommand function', async () => {
        const response = await client.typeCommand(key1, path);
        expect(response).to.equal('object', 'The response of the type command')
    });
    
    it('numincrbyCommand function', async () => {
        const response = await client.numincrbyCommand(key1, 2, '.x');
    });
    
    it('nummultbyCommand function', async () => {
        const response = await client.nummultbyCommand(key1, 3, '.x');
    });
    
    it('strappendCommand function', async () => {
        const response = await client.strappendCommand(key1, '"rrr"', '.str');
    });
    
    it('strlenCommand function', async () => {
        const response = await client.strlenCommand(key1, '.str')
    });
    
    it('arrappendCommand function', async () => {
        const response = await client.arrappendCommand(key3, [3,5,4,2], '.items')
    });
    
    it('arrindexCommand function', async () => {
        const response = await client.arrindexCommand(key3, '1', '.items');
    });
    
    it('arrinsertCommand function', async () => {
        const response = await client.arrinsertCommand(key3, 1, '{"z": 5}', '.items');
    });
    
    it('arrlenCommand function', async () => {
        const response = await client.arrlenCommand(key3, '.items');
    });
    
    it('arrpopCommand function', async () => {
        const response = await client.arrpopCommand(key3, 0, '.items');
    });
    
    it('arrtrimCommand function', async () => {
        const response = await client.arrtrimCommand(key3, 0, 1, '.items');
    });
    
    it('objkeysCommand function', async () => {
        const response = await client.objkeysCommand(key1, path);
    });
    
    it('objlenCommand function', async () => {
        const response = await client.objlenCommand(key1, path);
    });
    
    it('debugCommand function', async () => {
        const response = await client.debugCommand('MEMORY', key1, path);
    });
    
    it('forgetCommand function', async () => {
        const response = await client.forgetCommand(key2, path)
    });
    
    it('respCommand function', async () => {
        const response = await client.respCommand(key1, path)
    });

    it('delCommand function', async () => {
        const response = await client.delCommand(key1, path);
    });
});