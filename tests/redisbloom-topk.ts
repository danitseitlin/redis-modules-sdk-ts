import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomTopK } from '../modules/bloom-topk/redisbloom-topk';
import { Redis } from '../modules/redis';
let client: RedisBloomTopK;
let redis: Redis;
const key1 = 'key1topk';

describe('RedisBloom Top-K filter testing', async function() {
    before(async () => {
        client = new RedisBloomTopK({
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
    
    it('reserve function', async() => {
        const response = await client.reserve(key1, 1, 2, 3, 0.1);
        expect(response).to.equal('OK', 'The response of the TOPK.RESERVE command');
    })
    it('add function', async () => {
        const response = await client.add(key1, ['bar', 42])
        expect(response[0]).to.equal(null, 'The response of the TOPK.ADD command')
    });
    it('incrby function', async () => {
        const response = await client.incrby(key1, [{
            name: 42,
            increment: 1
        }])
        expect(response[0]).to.equal('bar', 'The response of the TOPK.INCRBY command');
    });
    it('query function', async () => {
        const response = await client.query(key1, [42, 'nonexist'])
        expect(response[0]).to.equal(1, 'The query response of key 42');
        expect(response[1]).to.equal(0, 'The query response of key nonexist');
    });
    it('count function', async () => {
        const response = await client.count(key1, ['foo', 42, 'nonexist'])
        expect(response[0]).to.equal(0, 'The response of the TOPK.COUNT command');
        expect(response[1]).to.equal(2, 'The response of the TOPK.COUNT command');
        expect(response[2]).to.equal(0, 'The response of the TOPK.COUNT command');
    });
    it('list function', async () => {
        const response = await client.list(key1);
        expect(response[0]).to.equal('42', 'The response of the TOPK.LIST command');
    });
    it('info function', async () => {
        const response = await client.info(key1);
        expect(response.length).to.equal(8, 'The length of items in the response')
    });
});