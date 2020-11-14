import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomCMK } from '../modules/redisbloom-cmk';
let client: RedisBloomCMK;

describe('RedisBloom Count-Min-Sketch filter testing', async function() {
    before(async () => {
        client = new RedisBloomCMK({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('initbydim function', async () => {
    });
    it('initbyprob function', async () => {
    });
    it('incrby function', async () => {
    });
    it('query function', async () => {
    });
    it('merge function', async () => {
    });
    it('info function', async () => {
    });
    
});