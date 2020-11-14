import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloom } from '../modules/redisbloom';
let client: RedisBloom;
const key1 = 'key1';
const item1 = 'item1';
let dataIterator: number;
let data: string;

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
        expect(response).to.equal(1, 'The response of the command (Success)')
    });
    it('madd function', async () => {
        const response = await client.madd(key1, [item1])
        console.log(response)
        expect(response[0]).to.equal(0, 'The response of the command (Failed)')
    });
    it('insert function', async () => {
        const response = await client.insert(key1, [item1])
        console.log(response)
        expect(response[0]).to.equal(0, 'The response of the command (Failed)')
    });
    it('exists function', async () => {
        const response = await client.exists(key1, item1)
        console.log(response)
        expect(response).to.equal(1, 'The response of the command (Success)')
    });
    it('mexists function', async () => {
        const response = await client.mexists(key1, [item1])
        console.log(response)
        expect(response[0]).to.equal(1, 'The response of the command (Success)')
    });
    it('info function', async () => {
        const response = await client.info(key1)
        console.log(response)
        expect(response[0]).to.equal('Capacity', 'The first item of the response')
        expect(response[1]).to.equal(100, 'The capacity')
    });
    it('scandump function', async () => {
        const response = await client.scandump(key1, 1)
        console.log(response)
        dataIterator = parseInt(response[0])
        data = response[1];
        expect(data).to.not.equal('', 'The chunk value')
    });
    it('loadchunk function', async () => {
        await client.redis.del(key1);
        const response = await client.loadchunk(key1, dataIterator, data)
        console.log(response)
        
    });
});