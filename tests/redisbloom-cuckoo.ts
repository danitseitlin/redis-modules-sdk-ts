import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomCuckoo } from '../modules/redisbloom-cuckoo';
import { Redis } from '../modules/redis';
const key1 = 'key1cuckoo'
const key2 = '1'
const key3 = 'cuckoo'
const chunks: {iterator: number, data: string}[] = [];
let client: RedisBloomCuckoo;
let redis: Redis;

describe('RedisBloom Cuckoo filter testing', async function() {
    before(async () => {
        client = new RedisBloomCuckoo({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        redis = new Redis({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
        await redis.connect();
    })
    after(async () => {
        await client.disconnect();
        await redis.disconnect();
    })

    it('reserve function', async () => {
        const response = await client.reserve(key2, 100);
        expect(response).to.equal('OK', 'The response of the \'CF.RESERVE\' command');
    })
    it('add function', async () => {
        let response = await client.add(key1, 'item');
        expect(response).to.equal(1, 'The response of the CF.ADD command');
        response = await client.add(key2, '1');
        expect(response).to.equal(1, 'The response of the CF.ADD command');
    });
    it('addnx function', async () => {
        const response = await client.addnx(key1, 'item1');
        expect(response).to.equal(1, 'The response of the CF.ADDNX command');
    });
    it('insert function', async () => {
        const response = await client.insert(key1, ['item4', 'item5'])
        expect(response[0]).to.equal(1, 'The response of the CF.INSERT command');
    });
    it('insertnx function', async () => {
        const response = await client.insertnx(key3, ['item'])
        expect(response[0]).to.equal(1, 'The response of the CF.INSERTNX command');
    });
    it('exists function', async () => {
        const response = await client.exists(key1, 'item1');
        expect(response).to.equal(1, 'The response of the CF.EXISTS command');
    });
    it('count function', async () => {
        const response = await client.count(key1, 'item1');
        expect(response).to.equal(1, 'The response of the CF.COUNT command');
    });
    it('scandump function', async () => {
        let iter = 0;
        let response = await client.scandump(key2, iter)
        let data = response[1]
        chunks.push({iterator: iter, data: data.replace('�', '')})
        iter = parseInt(response[0])
        while(iter != 0){
            response = await client.scandump(key2, iter)
            iter = parseInt(response[0])
            data = response[1]
            chunks.push({iterator: iter, data: data})
        }
        console.log(chunks)
        expect(chunks.length).gt(0, `The count of chunks of key ${key2}`)
    });
    it('loadchunk function', async () => {
        const chunk = chunks[1];
        const res = await client.loadchunk(key2, chunk.iterator, chunk.data);
        expect(res).to.equal('OK', `The response of load chunk with iterator ${chunk.iterator}`)
    });
    it('info function', async () => {
        const response = await client.info(key1);
        expect(response[1]).to.equal(1080, 'The size of the key');
        expect(response[3]).to.equal(512, 'The number of buckets of the key');
    });
    it('del function', async () => {
        const response = await client.del(key1, 'item1');
        expect(response).to.equal(1, 'The response of the CF.DEL command');
    });
});