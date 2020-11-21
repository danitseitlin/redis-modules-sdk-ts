import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomCuckoo } from '../modules/redisbloom-cuckoo';
let client: RedisBloomCuckoo;

describe('RedisBloom Cuckoo filter testing', async function() {
    before(async () => {
        client = new RedisBloomCuckoo({
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
    it('addnx function', async () => {
    });
    it('insert function', async () => {
    });
    it('insertnx function', async () => {
    });
    it('exists function', async () => {
    });
    it('count function', async () => {
    });
    it('scandump function', async () => {
    });
    it('loadchunk function', async () => {
    });
    it('info function', async () => {
    });
    it('del function', async () => {
    });
});