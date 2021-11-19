import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisModules } from '../modules/redis-modules';
const key1 = 'key1cuckoo'
const key2 = '1'
const key3 = 'cuckoo'
const chunks: {iterator: number, data: string}[] = [];
let redis: RedisModules;

describe('RedisBloom Cuckoo filter testing', async function() {
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
        const response = await redis.bloom_cuckoo_module_reserve(key2, 100, {
            bucketSize: 1
        });
        expect(response).to.equal('OK', 'The response of the \'CF.RESERVE\' command');
    })
    it('add function', async () => {
        let response = await redis.bloom_cuckoo_module_add(key1, 'item');
        expect(response).to.equal(1, 'The response of the CF.ADD command');
        response = await redis.bloom_cuckoo_module_add(key2, 'X');
        expect(response).to.equal(1, 'The response of the CF.ADD command');
    });
    it('addnx function', async () => {
        const response = await redis.bloom_cuckoo_module_addnx(key1, 'item1');
        expect(response).to.equal(1, 'The response of the CF.ADDNX command');
    });
    it('insert function', async () => {
        const response = await redis.bloom_cuckoo_module_insert(key1, ['item4', 'item5'])
        expect(response[0]).to.equal(1, 'The response of the CF.INSERT command');
    });
    it('insertnx function', async () => {
        const response = await redis.bloom_cuckoo_module_insertnx(key3, ['item'])
        expect(response[0]).to.equal(1, 'The response of the CF.INSERTNX command');
    });
    it('exists function', async () => {
        const response = await redis.bloom_cuckoo_module_exists(key1, 'item1');
        expect(response).to.equal(1, 'The response of the CF.EXISTS command');
    });
    it('count function', async () => {
        const response = await redis.bloom_cuckoo_module_count(key1, 'item1');
        expect(response).to.equal(1, 'The response of the CF.COUNT command');
    });
    it('scandump function', async () => {
        let iter = 0;
        let response = await redis.bloom_cuckoo_module_scandump(key2, iter)
        let data = response[1]
        chunks.push({iterator: iter, data: data})
        iter = parseInt(response[0])
        while(iter != 0){
            response = await redis.bloom_cuckoo_module_scandump(key2, iter)
            iter = parseInt(response[0])
            data = response[1]
            chunks.push({iterator: iter, data: data})
        }
        expect(chunks.length).gt(0, `The count of chunks of key ${key2}`)
    });
    it.skip('loadchunk function', async () => {
        const chunk = chunks[1];
        const res = await redis.bloom_cuckoo_module_loadchunk(key2, chunk.iterator, chunk.data.replace(/�/g, 'fffd'));
        expect(res).to.equal('OK', `The response of load chunk with iterator ${chunk.iterator}`)
    });
    it('info function', async () => {
        const response = await redis.bloom_cuckoo_module_info(key1);
        expect(response[1]).to.equal(1080, 'The size of the key');
        expect(response[3]).to.equal(512, 'The number of buckets of the key');
    });
    it('del function', async () => {
        const response = await redis.bloom_cuckoo_module_del(key1, 'item1');
        expect(response).to.equal(1, 'The response of the CF.DEL command');
    });
});