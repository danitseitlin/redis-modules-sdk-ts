import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisModules } from '../modules/redis-modules';
let redis: RedisModules;
const key1 = 'key1topk';

describe('RedisBloom Top-K filter testing', async function() {
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
    
    it('reserve function', async() => {
        const response = await redis.bloom_topk_module_reserve(key1, 1, 2, 3, 0.1);
        expect(response).to.equal('OK', 'The response of the TOPK.RESERVE command');
    })
    it('add function', async () => {
        const response = await redis.bloom_topk_module_add(key1, ['bar', 42])
        expect(response[0]).to.equal(null, 'The response of the TOPK.ADD command')
    });
    it('incrby function', async () => {
        const response = await redis.bloom_topk_module_incrby(key1, [{
            name: 42,
            increment: 1
        }])
        expect(response[0]).to.equal('bar', 'The response of the TOPK.INCRBY command');
    });
    it('query function', async () => {
        const response = await redis.bloom_topk_module_query(key1, [42, 'nonexist'])
        expect(response[0]).to.equal(1, 'The query response of key 42');
        expect(response[1]).to.equal(0, 'The query response of key nonexist');
    });
    it('count function', async () => {
        const response = await redis.bloom_topk_module_count(key1, ['foo', 42, 'nonexist'])
        expect(response[0]).to.equal(0, 'The response of the TOPK.COUNT command');
        expect(response[1]).to.equal(2, 'The response of the TOPK.COUNT command');
        expect(response[2]).to.equal(0, 'The response of the TOPK.COUNT command');
    });
    it('list function', async () => {
        const response = await redis.bloom_topk_module_list(key1);
        expect(response[0]).to.equal('42', 'The response of the TOPK.LIST command');
    });
    it('info function', async () => {
        const response = await redis.bloom_topk_module_info(key1);
        expect(response.length).to.equal(8, 'The length of items in the response')
    });
});