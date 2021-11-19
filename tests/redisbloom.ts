import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisModules } from '../modules/redis-modules';
let redis: RedisModules;
const key1 = 'key1bloom';
const key2 = '1';
const item1 = 'item1';
const chunks: {iterator: number, data: string}[] = [];

describe('RedisBloom Module testing', async function() {
    before(async () => {
        redis = new RedisModules({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await redis.connect();
    })
    after(async () => {
        await redis.disconnect();
    })
    
    it('reserve function', async () => {
        const response = await redis.bloom_module_reserve(key2, 0.01, 100);
        expect(response).to.equal('OK', 'The response of the \'BF.RESERVE\' command');
    })
    it('add function', async () => {
        const response = await redis.bloom_module_add(key1, item1)
        expect(response).to.equal(1, 'The response of the \'BF.ADD\' command')
    });
    it('madd function', async () => {
        const response = await redis.bloom_module_madd(key1, [item1])
        expect(response[0]).to.equal(0, 'The response of the \'BF.MADD\' command')
    });
    it('insert function', async () => {
        const response = await redis.bloom_module_insert(key1, [item1])
        expect(response[0]).to.equal(0, 'The response of the \'BF.INSERT\' command')
    });
    it('exists function', async () => {
        const response = await redis.bloom_module_exists(key1, item1)
        expect(response).to.equal(1, 'The response of the \'BF.EXISTS\' command')
    });
    it('mexists function', async () => {
        const response = await redis.bloom_module_mexists(key1, [item1])
        expect(response[0]).to.equal(1, 'The response of the \'BF.MEXISTS\' command')
    });
    it('info function', async () => {
        const response = await redis.bloom_module_info(key1)
        expect(response[0]).to.equal('Capacity', 'The first item of the information')
        expect(response[1]).to.equal(100, 'The value of the \'Capacity\' item')
    });
    it('scandump function', async () => {
        let iter = 0;
        let response = await redis.bloom_module_scandump(key2, iter)
        let data = response[1]
        chunks.push({iterator: iter, data: data})
        iter = parseInt(response[0])
        while(iter != 0){
            response = await redis.bloom_module_scandump(key2, iter)
            iter = parseInt(response[0])
            data = response[1]
            chunks.push({iterator: iter, data: data})
        }
        expect(chunks.length).gt(0, `The count of chunks of key ${key2}`)
    });
    it('loadchunk function', async () => {
        const chunk = chunks[1];
        const res = await redis.bloom_module_loadchunk(key2, chunk.iterator, chunk.data);
        expect(res).to.equal('OK', `The response of load chunk with iterator ${chunk.iterator}`)
    });
});