import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloom } from '../modules/redisbloom';
let client: RedisBloom;

describe('RedisBloom Module testing', async function() {
    before(async () => {
        client = new RedisBloom({
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
    it('madd function', async () => {
    });
    it('insert function', async () => {
    });
    it('exists function', async () => {
    });
    it('mexists function', async () => {
    });
    it('scandump function', async () => {
    });
    it('loadchunk function', async () => {
    });
    it('info function', async () => {
    });
    
});