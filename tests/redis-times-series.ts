import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisTimeSeries } from '../modules/redistimeseries';
let client: RedisTimeSeries;

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
        const response = await client.create('key', {
            labels:[{
                name: 'label',
                value: 'value'
            }]
        })
        console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('del function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('alter function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('add function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('madd function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('incrby function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('decrby function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('createRule function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('deleteRule function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('range function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('revrange function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mrange function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mrevrange function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('get function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('mget function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('info function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
    it('queryindex function', async () => {
        //const response = await client.del(key1, path);
        //console.log(response)
        //expect(response).to.equal(1, 'The response of the del command');
    });
});