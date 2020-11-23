import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloom } from '../modules/redisbloom';
let client: RedisBloom;
const key1 = 'key1bloom';
const key2 = 'key2bloom';
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
    it('reserve function', async () => {
        const response = await client.reserve(key2, 0.1, 1);
        expect(response).to.equal('OK', 'The response of the \'BF.RESERVE\' command');
    })
    it('add function', async () => {
        const response = await client.add(key1, item1)
        expect(response).to.equal(1, 'The response of the \'BF.ADD\' command')
    });
    it('madd function', async () => {
        const response = await client.madd(key1, [item1])
        expect(response[0]).to.equal(0, 'The response of the \'BF.MADD\' command')
    });
    it('insert function', async () => {
        const response = await client.insert(key1, [item1])
        expect(response[0]).to.equal(0, 'The response of the \'BF.INSERT\' command')
    });
    it('exists function', async () => {
        const response = await client.exists(key1, item1)
        expect(response).to.equal(1, 'The response of the \'BF.EXISTS\' command')
    });
    it('mexists function', async () => {
        const response = await client.mexists(key1, [item1])
        expect(response[0]).to.equal(1, 'The response of the \'BF.MEXISTS\' command')
    });
    it('info function', async () => {
        const response = await client.info(key1)
        expect(response[0]).to.equal('Capacity', 'The first item of the information')
        expect(response[1]).to.equal(100, 'The value of the \'Capacity\' item')
    });
    it('scandump function', async () => {
        const response = await client.scandump(key2, 0)
        console.log(response)
        dataIterator = parseInt(response[0])
        expect(dataIterator).to.equal(1, 'The chunk data iterator');
        data = response[1];
        expect(data).to.not.equal('', 'The chunk data')
    });
    it('loadchunk function', async () => {
        await client.redis.del(key2);
        const response = await client.loadchunk(key2, dataIterator, data)
        console.log(response)
    });
});