import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { ReJSON } from '../modules/rejson';
let client: ReJSON;

describe('RedisJSON Module testing', async function() {
    before(async () => {
        client = new ReJSON({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
    })
    after(async () => {
        client.disconnect();
    })

    it('delCommand function', async () => {
        console.log(await client.setCommand('key', '.', "{x: 1}"));
    });

    it(' function', async () => {
    });

    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
    
    it(' function', async () => {
    });
});