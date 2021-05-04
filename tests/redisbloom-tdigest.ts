import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Redis } from '../modules/redis';
import { RedisBloomTDigest } from '../modules/redisbloom-tdigest';
let client: RedisBloomTDigest;
let redis: Redis;
const key1 = 'mykey1'
const key2 = 'mykey2';

describe('RedisBloom TDigest filter testing', async function() {
    before(async () => {
        client = new RedisBloomTDigest({
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

    it('create function', async () => {
        let response = await client.create(key1, 100);
        expect(response).to.equal('OK', 'The response of \'TDIGEST.CREATE\' command');
        response = await redis.bloom_tdigest_module_create(key2, 100);
        expect(response).to.equal('OK', 'The response of \'TDIGEST.CREATE\' command');
    });
    it('reset function', async () => {
        const response = await client.reset(key1);
        expect(response).to.equal('OK', 'The response of \'TDIGEST.RESET\' command');
    });
    it('add function', async () => {
        const response = await client.add(key1, [{
            value: 1500.0,
            weight: 1.0
        }])
        expect(response).to.equal('OK', 'The response of \'TDIGEST.ADD\' command');
    });
    it('merge function', async () => {
        const response = await client.merge(key1, key2);
        expect(response).to.equal('OK', 'The response of \'TDIGEST.MERGE\' command');
    });
    it('max function', async () => {
        const response = await client.max(key1);
        expect(response).to.eql('1500', 'The response of \'TDIGEST.MAX\' command')
    });
    it('min function', async () => {
        const response = await client.min(key1);
        expect(response).to.eql('1500', 'The response of \'TDIGEST.MIN\' command')
    });
    it('quantile function', async () => {
        const response = await client.quantile(key1, 0.5);
        expect(response).to.eql('1500', 'The response of \'TDIGEST.QUANTILE\' command')
    });
    it('cdf function', async () => {
        const response = await client.cdf(key1, 10);
        expect(response).to.eql('0', 'The response of \'TDIGEST.CDF\' command')
    });
    it('info function', async () => {
        const response = await client.info(key1);
        expect(response.Compression).to.eql(100, 'The compression')
        expect(response.Capacity).to.eql(610, 'The capacity')
        expect(response['Merged nodes']).to.eql(1, 'The merged nodes')
        expect(response['Unmerged nodes']).to.eql(0, 'The unmerged nodes')
        expect(response['Merged weight']).to.eql('1', 'The merged weight')
        expect(response['Unmerged weight']).to.eql('0', 'The unmerged weight')
        expect(response['Total compressions']).to.eql(1, 'The total compressions')
    });
});