import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomTopK } from '../modules/redisbloom-topk';
//import { RedisBloom } from '../modules/redisbloom';
//let bloomClient: RedisBloom;
let client: RedisBloomTopK;
const key1 = 'key1topk';
describe('RedisBloom Top-K filter testing', async function() {
    before(async () => {
        const options = {
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        }
        //bloomClient = new RedisBloom(options);
        client = new RedisBloomTopK(options);
        await client.connect();
        //await bloomClient.connect();
    })
    after(async () => {
        await client.disconnect();
        //await bloomClient.disconnect();
    })
    it('reserve function', async() => {
        const response = await client.reserve(key1, 1, 2, 3, 0.1);
        console.log(response)
        expect(response).to.equal('OK', 'The response of the TOPK.RESERVE command');
    })
    it('add function', async () => {
        //await bloomClient.add(key1, 'foo')
        const response = await client.add(key1, ['bar', 42])
        console.log(response)
        expect(response[0]).to.equal(null, 'The response of the TOPK.ADD command')
    });
    it('incrby function', async () => {
        const response = await client.incrby(key1, [{
            item: 42,
            increment: 1
        }])
        console.log(response)

    });
    it('query function', async () => {
        const response = await client.query(key1, [42, 'nonexist'])
        console.log(response)
        expect(response[0]).to.equal(0, 'The response of the TOPK.QUERY command');
        expect(response[1]).to.equal(0, 'The response of the TOPK.QUERY command');
    });
    it('count function', async () => {
        const response = await client.count(key1, ['foo', 42, 'nonexist'])
        console.log(response)
        expect(response[0]).to.equal(0, 'The response of the TOPK.COUNT command');
        expect(response[1]).to.equal(1, 'The response of the TOPK.COUNT command');
        expect(response[2]).to.equal(0, 'The response of the TOPK.COUNT command');
    });
    it('list function', async () => {
        const response = await client.list(key1);
        console.log(response)
        expect(response[0]).to.equal('bar', 'The response of the TOPK.LIST command');
    });
    it('info function', async () => {
        const response = await client.info(key1);
        console.log(response)
    });
    
});