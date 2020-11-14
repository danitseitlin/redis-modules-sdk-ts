import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloom } from '../modules/redisbloom';
let client: RedisBloom;
const key1 = 'key1';
const item1 = 'item1';
let data: string[];

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
        const response = await client.add(key1, item1)
        console.log(response)
    });
    it('madd function', async () => {
        const response = await client.madd(key1, [item1])
        console.log(response)
    });
    it('insert function', async () => {
        const response = await client.insert(key1, [item1])
        console.log(response)
    });
    it('exists function', async () => {
        const response = await client.exists(key1, item1)
        console.log(response)
    });
    it('mexists function', async () => {
        const response = await client.mexists(key1, [item1])
        console.log(response)
    });
    it('scandump function', async () => {
        const response = await client.scandump(key1, 0.1)
        console.log(response)
        data = response;
    });
    it('loadchunk function', async () => {
        const response = await client.loadchunk(key1, 0.1, data)
        console.log(response)
    });
    it('info function', async () => {
        const response = await client.info(key1)
        console.log(response)
    });
    
});