import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisTimeSeries } from '../modules/redistimeseries';
let client: RedisTimeSeries;
const key1 = 'key:2:32';
const key2 = 'key:2:33';
describe('RedisTimesSeries Module testing', async function() {
    before(async () => {
        client = new RedisTimeSeries({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('create function', async () => {
        let response = await client.create(key1, {
            labels:[{
                name: 'label',
                value: 'value'
            }]
        })
        expect(response).to.equal('OK', 'The response of the create command');
        response = await client.create(key2, {
            labels:[{
                name: 'label1',
                value: 'value1'
            }]
        })
        expect(response).to.equal('OK', 'The response of the create command');
    });
    
    it('alter function', async () => {
        const response = await client.alter(key1, 1);
        expect(response).to.equal('OK', 'The response of the alter command');
    });
    it('add function', async () => {
        const response = await client.add(key1, '1548149180000', '26')
        expect(response).to.equal(1548149180000, 'The response of the add command');
    });
    it('madd function', async () => {
        const response = await client.madd([{
            key: key1,
            timestamp: '*',
            value: '32'
        }])
        expect(response.length).to.equal(1, 'The response of the madd command');
    });
    it('incrby function', async () => {
        const currentValue = parseInt((await client.get(key1))[1].toString())
        await client.incrby(key1, '1')
        const newValue = parseInt((await client.get(key1))[1].toString())
        expect(newValue).to.be.above(currentValue, 'The response of the incrby command');
    });
    it('decrby function', async () => {
        const currentValue = parseInt((await client.get(key1))[1].toString())
        await client.decrby(key1, '1')
        const newValue = parseInt((await client.get(key1))[1].toString())
        expect(currentValue).to.be.above(newValue, 'The response of the decrby command');
    });
    it('createrule function', async () => {
        const response = await client.createrule({
            sourceKey: key1,
            destKey: key2,
            aggregation: 'avg',
            timeBucket: 1
        })
        expect(response).to.equal('OK', 'The response of the createrule command');
    });
    it('deleterule function', async () => {
        const response = await client.deleterule(key1, key2);
        expect(response).to.equal('OK', 'The response of the deleterule command');
    });
    it('range function', async () => {
        const data = await client.get(key1);
        const response = await client.range(key1, data[0].toString(), data[1].toString())
        console.log(response)
        //expect(response).to.equal(1, 'The response of the range command');
    });
    it('revrange function', async () => {
        const data = await client.get(key1);
        const response = await client.revrange(key1, data[0].toString(), data[1].toString())
        console.log(response)
        //expect(response).to.equal(1, 'The response of the revrange command');
    });
    it('mrange function', async () => {
        const data = await client.get(key1);
        const response = await client.mrange(key1, data[0].toString(), data[0].toString(), 'label=value')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the mrange command');
    });
    it('mrevrange function', async () => {
        const data = await client.get(key1);
        const response = await client.mrevrange(key1, data[0].toString(), data[0].toString(), 'label=value')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the mrevrange command');
    });
    it('get function', async () => {
        const response = await client.get(key1);
        expect(response.length).to.equal(2, 'The response of the get command');
    });
    it('mget function', async () => {
        const response = await client.mget('label=value');
        console.log(response)
        expect(response.length).to.equal(2, 'The response of the mget command');
    });
    it('info function', async () => {
        const response = await client.info(key1)
        expect(response.totalSamples).to.equal(1, 'The total samples of the key');
    });
    it('queryindex function', async () => {
        const response = await client.queryindex('label=value')
        expect(response.length).eql(1, 'The response of the queryindex command');
    });
    it('del function', async () => {
        const response = await client.del(key1);
        expect(response).to.equal(1, 'The response of the del command');
    });
});