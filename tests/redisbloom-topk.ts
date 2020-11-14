import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomTopK } from '../modules/redisbloom-topk';
let client: RedisBloomTopK;

describe('RedisBloom Top-K filter testing', async function() {
    before(async () => {
        client = new RedisBloomTopK({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('add function', async () => {
    });
    it('incrby function', async () => {
    });
    it('query function', async () => {
    });
    it('count function', async () => {
    });
    it('list function', async () => {
    });
    it('info function', async () => {
    });
    
});