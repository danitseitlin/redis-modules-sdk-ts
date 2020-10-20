import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Redisjson } from '../modules/redisjson';
const client = new Redisjson({
    host: cliArguments.host,
    port: parseInt(cliArguments.port),
    password: cliArguments.password
});

describe('Sanity testing', async function() {
    before(async () => {
        await client.connect();
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