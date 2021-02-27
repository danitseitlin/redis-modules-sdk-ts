import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisIntervalSets } from '../modules/redis-interval-sets';
let client: RedisIntervalSets;

describe('RedisGraph Module testing', async function() {
    before(async () => {
        client = new RedisIntervalSets({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('set function', async () => {
        const response = await client.set('ages', [{
            name: 'parents',
            minimum: 20,
            maximum: 100
        },{
            name: 'kids',
            minimum: 0,
            maximum: 100  
        }])
        expect(response).to.eql('OK', 'The response of the \'is.set\' command');
    });

    it('get function', async () => {

    });

    it('del function', async () => {
    });

    it('score function', async () => {
    });

    it('notScore function', async () => {
    });
});