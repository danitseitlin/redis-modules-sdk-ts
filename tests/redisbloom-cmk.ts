import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomCMK } from '../modules/redisbloom-cmk';
let client: RedisBloomCMK;
const key1 = 'key1cmk'
const key2 = 'key1cmk2';

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
        let response = await client.initbydim('dest', 1, 2);
        response = await client.initbydim(key1, 1, 2);
        console.log(response)
    });
    it('initbyprob function', async () => {
        const response = await client.initbyprob(key2, 0.001, 0.01);
        console.log(response)
    });
    it('incrby function', async () => {
        const response = await client.incrby(key1, [{
            name: 'foo',
            increment: 10
        }]);
        console.log(response)
    });
    it('query function', async () => {
        const response = await client.query(key1, ['foo']);
        console.log(response)
    });
    it('merge function', async () => {
        const response = await client.merge('dest', 2, [key1]);
        console.log(response)
    });
    it('info function', async () => {
        const response = await client.info(key1);
        console.log(response);
    });
    
});