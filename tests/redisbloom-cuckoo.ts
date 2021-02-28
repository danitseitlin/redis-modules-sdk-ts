import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomCuckoo } from '../modules/redisbloom-cuckoo';
const key1 = 'key1cuckoo'
const key2 = 'key2cuckoo'
const key3 = 'key3cuckoo'
let client: RedisBloomCuckoo;
let dataIterator: number;
let data: string;

describe('RedisBloom Cuckoo filter testing', async function() {
    before(async () => {
        client = new RedisBloomCuckoo({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('add function', async () => {
        const response = await client.add(key1, 'item');
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
    it.skip('scandump function', async () => {
        await client.add(key2, 'item');
        await client.rediset.del(key2);
        const response = await client.scandump(key1, 123)
        console.log(response)
        dataIterator = parseInt(response[0])
        expect(dataIterator).to.equal(1, 'The chunk data iterator');
        data = response[1];
        expect(data).to.not.equal('', 'The chunk data')
    });
    it.skip('loadchunk function', async () => {
        const response = await client.loadchunk(key2, dataIterator, data);
        console.log(response)
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