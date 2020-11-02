import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisTimeSeries } from '../modules/redistimeseries';
let client: RedisTimeSeries;
const key = 'key';
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
        const response = await client.create(key, {
            labels:[{
                name: 'label',
                value: 'value'
            }]
        })
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    
    it('alter function', async () => {
        const response = await client.alter(key, 1);
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('add function', async () => {
        const response = await client.add(key, '1548149180000', '26')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('madd function', async () => {
        const response = await client.madd([{
            key: key,
            timestamp: '*',
            value: '32'
        }])
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('incrby function', async () => {
        const response = await client.incrby(key, '1')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('decrby function', async () => {
        const response = await client.decrby(key, '2')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('createrule function', async () => {
        const response = await client.createrule({
            sourceKey: key,
            destKey: `${key}1`,
            aggregation: 'avg',
            timeBucket: 1
        })
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('deleterule function', async () => {
        const response = await client.deleterule(key, `${key}1`);
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('range function', async () => {
        const response = await client.range(key, 1, 2)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('revrange function', async () => {
        const response = await client.revrange(key, 1, 2)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mrange function', async () => {
        const response = await client.mrange(key, 1, 2, 'l=v')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mrevrange function', async () => {
        const response = await client.mrevrange(key, 1, 2, 'l=v')
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('get function', async () => {
        const response = await client.get(key);
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mget function', async () => {
        const response = await client.mget('l=v');
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('info function', async () => {
        const response = await client.info(key)
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('queryindex function', async () => {
        const response = await client.queryindex('l=v')
        console.log(response)
        expect(response).to.equal(1, 'The response of the del command');
    });
    it('del function', async () => {
        const response = await client.del(key);
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
});