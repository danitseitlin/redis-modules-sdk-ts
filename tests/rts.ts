import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisTimeSeries } from '../modules/redistimeseries';
let client: RedisTimeSeries;
const key1 = 'key';
const key2 = 'key1';
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
            timestamp: '1548149180000',
            value: '32'
        }])
        console.log(response)
        //expect(response).to.equal(1, 'The response of the madd command');
    });
    it('incrby function', async () => {
        const response = await client.incrby(key1, '1')
        expect(response).to.equal(1604361665688, 'The response of the incrby command');
    });
    it('decrby function', async () => {
        const response = await client.decrby(key1, '2')
        expect(response).to.equal(1604361665688, 'The response of the decrby command');
    });
    it('createrule function', async () => {
        const response = await client.createrule({
            sourceKey: key1,
            destKey: key2,
            aggregation: 'avg',
            timeBucket: 1
        })
        console.log(response)
        expect(response).to.equal('OK', 'The response of the createrule command');
    });
    it('deleterule function', async () => {
        const response = await client.deleterule(key1, key2);
        console.log(response)
        expect(response).to.equal('OK', 'The response of the deleterule command');
    });
    it('range function', async () => {
        const response = await client.range(key1, 1, 1604361665700)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the range command');
    });
    it('revrange function', async () => {
        const response = await client.revrange(key1, 1, 1604361665700)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the revrange command');
    });
    it('mrange function', async () => {
        const response = await client.mrange(key1, 1, 1604361665700, 'l=label')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the mrange command');
    });
    it('mrevrange function', async () => {
        const response = await client.mrevrange(key1, 1, 1604361665700, 'l=label')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the mrevrange command');
    });
    it('get function', async () => {
        const response = await client.get(key1);
        expect(response).to.equal([ 1604361665689, '25' ], 'The response of the get command');
    });
    it('mget function', async () => {
        const response = await client.mget('l=label');
        console.log(response)
        //expect(response).to.equal(1, 'The response of the mget command');
    });
    it('info function', async () => {
        const response = await client.info(key1)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the info command');
    });
    it('queryindex function', async () => {
        const response = await client.queryindex('l=label')
        expect(response).to.equal([], 'The response of the queryindex command');
    });
    it('del function', async () => {
        const response = await client.del(key1);
        console.log(response)
        expect(response).to.equal(1, 'The response of the del command');
    });
});