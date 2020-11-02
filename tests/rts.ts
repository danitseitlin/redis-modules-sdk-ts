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
        console.log(response)
        response = await client.create(key2, {
            labels:[{
                name: 'label1',
                value: 'value1'
            }]
        })
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    
    it('alter function', async () => {
        const response = await client.alter(key1, 1);
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('add function', async () => {
        const response = await client.add(key1, '1548149180000', '26')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('madd function', async () => {
        const response = await client.madd([{
            key: key1,
            timestamp: '*',
            value: '32'
        }])
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('incrby function', async () => {
        const response = await client.incrby(key1, '1')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('decrby function', async () => {
        const response = await client.decrby(key1, '2')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('createrule function', async () => {
        const response = await client.createrule({
            sourceKey: key1,
            destKey: key2,
            aggregation: 'avg',
            timeBucket: 1
        })
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('deleterule function', async () => {
        const response = await client.deleterule(key1, key2);
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('range function', async () => {
        const response = await client.range(key1, 1, 2)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('revrange function', async () => {
        const response = await client.revrange(key1, 1, 2)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mrange function', async () => {
        const response = await client.mrange(key1, 1, 2, 'l=label')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mrevrange function', async () => {
        const response = await client.mrevrange(key1, 1, 2, 'l=label')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('get function', async () => {
        const response = await client.get(key1);
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mget function', async () => {
        const response = await client.mget('l=label');
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('info function', async () => {
        const response = await client.info(key1)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('queryindex function', async () => {
        const response = await client.queryindex('l=label')
        console.log(response)
        expect(response).to.equal(1, 'The response of the del command');
    });
    it('del function', async () => {
        const response = await client.del(key1);
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
});