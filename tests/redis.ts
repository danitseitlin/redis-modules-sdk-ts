import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Redis, } from '../modules/redis';
import { RedisIntervalSets } from '../modules/ris';
let client: Redis;

describe('AI testing', async function() {
    before(async () => {
        client = new Redis({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('tensorset function', async () => {
        new Redis({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
    });
    
})