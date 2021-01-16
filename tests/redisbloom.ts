import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloom } from '../modules/redisbloom';
let client: RedisBloom;
const key1 = 'key1bloom';
const key2 = 'key2bloom';
const key3 = 'k1';
const item1 = 'item1';
const responses: [number, Buffer][] = []
let dataIterator: number;
let data: string;
import { StringDecoder } from 'string_decoder'
describe('RedisBloom Module testing', async function() {
    before(async () => {
        client = new RedisBloom({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })
    it('reserve function', async () => {
        let response = await client.reserve(key2, 0.1, 1);
        expect(response).to.equal('OK', 'The response of the \'BF.RESERVE\' command');
        response = await client.reserve(key3, 0.01, 100);
        expect(response).to.equal('OK', 'The response of the \'BF.RESERVE\' command');
    })
    it('add function', async () => {
        let response = await client.add(key1, item1)
        expect(response).to.equal(1, 'The response of the \'BF.ADD\' command')
        response = await client.add(key3, '1')
        expect(response).to.equal(1, 'The response of the \'BF.ADD\' command')
    });
    it('madd function', async () => {
        const response = await client.madd(key1, [item1])
        expect(response[0]).to.equal(0, 'The response of the \'BF.MADD\' command')
    });
    it('insert function', async () => {
        const response = await client.insert(key1, [item1])
        expect(response[0]).to.equal(0, 'The response of the \'BF.INSERT\' command')
    });
    it('exists function', async () => {
        const response = await client.exists(key1, item1)
        expect(response).to.equal(1, 'The response of the \'BF.EXISTS\' command')
    });
    it('mexists function', async () => {
        const response = await client.mexists(key1, [item1])
        expect(response[0]).to.equal(1, 'The response of the \'BF.MEXISTS\' command')
    });
    it('info function', async () => {
        const response = await client.info(key1)
        expect(response[0]).to.equal('Capacity', 'The first item of the information')
        expect(response[1]).to.equal(100, 'The value of the \'Capacity\' item')
    });
    it('scandump function', async () => {
        let response = await client.scandump(key3, 0)
        console.log(response)
        
        dataIterator = response[0]
        expect(dataIterator).to.equal(1, 'The chunk data iterator');
        while(dataIterator > 0){
            responses.push(response);
            response = await client.scandump(key3, dataIterator)
            console.log(response)
            dataIterator = response[0]
            //const decoder = new StringDecoder('utf16le');
            //const cent = Buffer.from(response[1]);
            //console.log(decoder.write(cent));
        }
        //for(let i = 0; i < responses[0][1].length; i++) {
        //    console.log(responses[0][1][i]);
        //}
        //const buffer = Buffer.from(response[1], 'hex');
        //console.log(buffer.toString())
        //data = buffer.toString('hex')//Buffer.from(response[1], 'utf16');//Buffer.from(response[1]).toString();
        console.log(data)
        expect(data).to.not.equal('', 'The chunk data')
    });
    it('loadchunk function', async () => {
        await client.redis.del(key3);
        for(const res of responses) {
            //console.log(`\n=== ${res[0]} ===`)
            //console.log(Buffer.from(res[1], 'ascii').toString('hex'))
            //console.log(Buffer.from(res[1], 'ascii').toString('ascii'))
            //console.log(Buffer.from(res[1], 'ascii').toString('base64'))
            //console.log(Buffer.from(res[1], 'ascii').toString('binary'))
            //console.log(Buffer.from(res[1], 'ascii').toString('utf-8'))
            //console.log(Buffer.from(res[1], 'ascii').toString('utf8'))
            //console.log(Buffer.from(res[1], 'ascii').toString('utf16le'))
            console.log(await client.loadchunk(key3, res[0], res[1]))
        }
        //const response = await client.loadchunk(key2, dataIterator, data)
        //console.log(response)
    });
});