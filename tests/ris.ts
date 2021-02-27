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
        console.log(await client.get('ages'))
        console.log(await client.get('ages', ['kids']))
    });

    it('score function', async () => {
        const sets = await client.score('ages', 5)
        expect(sets.length).to.eql(1, 'The number of sets');
        expect(sets[0]).to.eql('kids', 'The name of the set');
    });

    it('notScore function', async () => {
        const sets = await client.notScore('ages', 5)
        expect(sets.length).to.eql(1, 'The number of sets');
        expect(sets[0]).to.eql('parents', 'The name of the set');
    });

    it('del function', async () => {
        let response = await client.del('ages', ['kids'])
        expect(response).to.eql('OK', 'The response of the \'is.del\' command');
        response = await client.del('ages')
        expect(response).to.eql('OK', 'The response of the \'is.del\' command');
    });
});