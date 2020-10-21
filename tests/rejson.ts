import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Redisjson } from '../modules/redisjson';
let client: Redisjson;;

describe('RedisJSON Module testing', async function() {
    before(async () => {
        client = new Redisjson({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
    })
    after(async () => {
        client.disconnect();
    })

    it('delCommand function', async () => {

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