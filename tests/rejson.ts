import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { ReJSON } from '../modules/rejson';
import { createPublicKey } from 'crypto';
let client: ReJSON;
const key1 = 'key1';
const key2 = 'key2';
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
        console.log(await client.setCommand(key1, path, '{"x": 1}'));
    });

    it('getCommand function', async () => {
        console.log(await client.getCommand(key1, path))
    });

    
    it('mgetCommand function', async () => {
        console.log(await client.setCommand(key2, path, '{"x": 3}'));
        console.log(await client.mgetCommand([key1, key2], path));
    });
    
    it('typeCommand function', async () => {
        console.log(await client.typeCommand(key1, path));
    });
    
    it('numincrbyCommand function', async () => {
        console.log(await client.numincrbyCommand(key1, 1, path));
    });
    
    it('nummultbyCommand function', async () => {
        console.log(await client.nummultbyCommand(key1, 1, path));
    });
    
    it('strappendCommand function', async () => {
        console.log(await client.strappendCommand(key1, ',{"y": 2}', path));
    });
    
    it('strlenCommand function', async () => {
        console.log(await client.strlenCommand(key1, path))
    });
    
    it('arrappendCommand function', async () => {
        console.log(await client.arrappendCommand(key1, '{"y": 6}', path))
    });
    
    it('arrindexCommand function', async () => {
        console.log(await client.arrindexCommand(key1, 'y', path));
    });
    
    it('arrinsertCommand function', async () => {
        console.log(await client.arrinsertCommand(key1, 1, '{"z": 5}', path));
    });
    
    it('arrlenCommand function', async () => {
        console.log(await client.arrlenCommand(key1, '.'));
    });
    
    it('arrpopCommand function', async () => {
        console.log(await client.arrpopCommand(key1, 0, path));
    });
    
    it('arrtrimCommand function', async () => {
        console.log(await client.arrtrimCommand(key1, 0, 1, path));
    });
    
    it('objkeysCommand function', async () => {
        console.log(await client.objkeysCommand(key1, path));
    });
    
    it('objlenCommand function', async () => {
        console.log(await client.objlenCommand(key1, path));
    });
    
    it('debugCommand function', async () => {
        console.log(await client.debugCommand('MEMORY', key1, path));
    });
    
    it('forgetCommand function', async () => {
        console.log(await client.forgetCommand(key2, path))
    });
    
    it('respCommand function', async () => {
        console.log(await client.respCommand(key1, path))
    });

    it('delCommand function', async () => {
        console.log(client.delCommand(key1, path));
    });
});