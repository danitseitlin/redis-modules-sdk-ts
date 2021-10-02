import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisTimeSeries } from '../modules/rts/rts';
import { RedisModules } from '../modules/redis-modules';
let client: RedisTimeSeries;
let redis: RedisModules;
const date = new Date(2019, 11, 24, 19).getTime();
const key1 = 'key:2:32';
const key2 = 'key:2:33';
describe('RTS Module testing', async function() {
    before(async () => {
        client = new RedisTimeSeries({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        redis = new RedisModules({
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
        const response = await client.add(key1, `${date}`, '26', { onDuplicate: 'SUM'})
        expect(response).to.equal(date, 'The response of the add command');
    });
    it('madd function', async () => {
        const info = await client.info(key1);
        const response = await client.madd([{
            key: key1,
            timestamp: info.firstTimestamp.toString(),
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
        let response = await client.range(key1, data[0].toString(), data[1].toString())
        expect(response.length).to.equal(0, 'The range items length of the response')
        response = await client.range(key1, `${data[0]}`, `${data[1]}`, {
            align: 'start',
            aggregation: {
                type: 'count',
                timeBucket: 10
            }
        });
        expect(response.length).to.equal(0, 'The range items length of the response')
    });
    it('revrange function', async () => {
        const data = await client.get(key1);
        let response = await client.revrange(key1, data[0].toString(), data[1].toString())
        expect(response.length).to.equal(0, 'The range items length of the response')
        response = await client.revrange(key1, `${data[0]}`, `${data[1]}`, {
            align: 'start',
            aggregation: {
                type: 'count',
                timeBucket: 10
            }
        });
        expect(response.length).to.equal(0, 'The range items length of the response')
    });
    it('mrange function', async () => {
        const info = await client.info(key1);
        const fromTimestamp = (info.firstTimestamp-1);
        const toTimestamp = (info.lastTimestamp+10000);
        const key = 'key:2:32';
        const filter = 'label=value';
        let response = await client.mrange(`${fromTimestamp}`, `${toTimestamp}`, filter);
        expect(response[0][0]).to.equal(key, 'The filtered key name');
        response = await client.mrange(`${fromTimestamp}`, `${toTimestamp}`, filter, {
            groupBy: {
                label: 'label',
                reducer: 'MAX'
            },
            withLabels: true
        });
        expect(response[0][0]).to.equal(filter, 'The value of the filter');
        expect(response[0][1][0][0]).to.equal('label', 'The name of the label');
        expect(response[0][1][0][1]).to.equal('value', 'The value of the label value');
        expect(response[0][1][1][0]).to.equal('__reducer__', 'The key of the reducer');
        expect(response[0][1][1][1]).to.equal('max', 'The value of the reducer');
        expect(response[0][1][2][0]).to.equal('__source__', 'The key of the source');
        expect(response[0][1][2][1]).to.equal(key, 'The value of the source');
    });
    it('mrevrange function', async () => {
        const info = await client.info(key1);
        let response = await client.mrevrange((info.firstTimestamp-1).toString(), (info.lastTimestamp+10000).toString(), 'label=value')
        expect(response[0][0]).to.equal('key:2:32', 'The filtered key name');
        response = await client.mrevrange(`${info.firstTimestamp-1}`, `${info.lastTimestamp+10000}`, 'label=value', {
            align: '+',
            aggregation: {
                type: 'count',
                timeBucket: 10
            }
        })
        expect(response[0][0]).to.equal('key:2:32', 'The filtered key name');
    });
    it('get function', async () => {
        const response = await client.get(key1);
        expect(response.length).to.equal(2, 'The response of the get command');
    });
    it('mget function', async () => {
        let response = await client.mget('label=value');
        expect(response.length).to.equal(1, 'The response of the mget command');
        response = await client.mget('label=value label1=value1');
        expect(response.length).to.equal(1, 'The response of the mget command');
        response = await client.mget('label=value x=(a,b,c)');
        expect(response.length).to.equal(1, 'The response of the mget command');
    });
    it('info function', async () => {
        const response = await client.info(key1)
        expect(response.totalSamples).to.be.greaterThan(0, 'The total samples of the key');
    });
    it('queryindex function', async () => {
        const response = await client.queryindex('label=value')
        expect(response.length).eql(1, 'The response of the queryindex command');
    });
    it('del function', async() => {
        const samplesCount = await client.del(key1, date.toString(), new Date().getTime().toString())
        expect(samplesCount).eql(3, 'The response TS.DEL command')
    })
});