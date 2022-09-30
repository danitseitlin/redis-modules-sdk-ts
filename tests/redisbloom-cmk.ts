import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisModules } from '../';
let redis: RedisModules;
const key1 = 'key1cmk'
const key2 = 'key1cmk2';

describe('RedisBloom Count-Min-Sketch filter testing', async function() {
    before(async () => {

        redis = new RedisModules({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await redis.connect();
    })
    after(async () => {
        await redis.disconnect();
    })

    it('initbydim function', async () => {
        let response = await redis.bloom_cmk_module_initbydim('dest', 1, 2);
        expect(response).to.equal('OK', 'The response of CMS.INITBYDIM command');
        response = await redis.bloom_cmk_module_initbydim(key1, 1, 2);
        expect(response).to.equal('OK', 'The response of CMS.INITBYDIM command');
    });
    it('initbyprob function', async () => {
        const response = await redis.bloom_cmk_module_initbyprob(key2, 0.001, 0.01);
        expect(response).to.equal('OK', 'The response of CMS.INITBYPROB command');
    });
    it('incrby function', async () => {
        const response = await redis.bloom_cmk_module_incrby(key1, [{
            name: 'foo',
            increment: 10
        }]);
        expect(response[0]).to.equal(10, 'The response of CMS.INCRBY command');
    });
    it('query function', async () => {
        const response = await redis.bloom_cmk_module_query(key1, ['foo']);
        expect(response[0]).to.equal(10, 'The response of CMS.QUERY command');
    });
    it('merge function', async () => {
        const response = await redis.bloom_cmk_module_merge('dest', 1, [key1]);
        expect(response).to.equal('OK', 'The response of CMS.MERGE command');
    });
    it('info function', async () => {
        const response = await redis.bloom_cmk_module_info(key1);
        expect(response[1]).to.equal(1, 'The width of the key');
        expect(response[3]).to.equal(2, 'The depth of the key');
        expect(response[5]).to.equal(10, 'The count of the key');
    });
});