import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloomCMK } from '../modules/redisbloom-cmk';
let client: RedisBloomCMK;
const key1 = 'key1cmk'
const key2 = 'key1cmk2';

describe('RedisBloom Count-Min-Sketch filter testing', async function() {
    before(async () => {
        client = new RedisBloomCMK({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('initbydim function', async () => {
        let response = await client.initbydim('dest', 1, 2);
        expect(response).to.equal('OK', 'The response of CMS.INITBYDIM command');
        response = await client.initbydim(key1, 1, 2);
        expect(response).to.equal('OK', 'The response of CMS.INITBYDIM command');
    });
    it('initbyprob function', async () => {
        const response = await client.initbyprob(key2, 0.001, 0.01);
        console.log(response)
        expect(response).to.equal('OK', 'The response of CMS.INITBYPROB command');
    });
    it('incrby function', async () => {
        const response = await client.incrby(key1, [{
            name: 'foo',
            increment: 10
        }]);
        console.log(response)
        expect(response[0]).to.equal(10, 'The response of CMS.INCRBY command');
    });
    it('query function', async () => {
        const response = await client.query(key1, ['foo']);
        console.log(response)
        expect(response[0]).to.equal(10, 'The response of CMS.QUERY command');
    });
    it('merge function', async () => {
        const response = await client.merge('dest', 1, [key1]);
        console.log(response)
        expect(response).to.equal('OK', 'The response of CMS.MERGE command');
    });
    it('info function', async () => {
        const response = await client.info(key1);
        console.log(response);
        expect(response[1]).to.equal(1, 'The width of the key');
        expect(response[3]).to.equal(2, 'The depth of the key');
        expect(response[5]).to.equal(10, 'The count of the key');
    });
    
});