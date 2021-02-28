import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisIntervalSets } from '../modules/ris';
let client: RedisIntervalSets;

describe('RedisIntervalSets Module testing', async function() {
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
        expect(response).to.eql('OK', 'The response of the \'iset.add\' command');
    });

    it('get function', async () => {
        let sets = await client.get('ages')
        expect(sets.length).to.eql(2, 'The number of sets');
        sets = await client.get('ages', 'kids')
        expect(sets.length).to.eql(1, 'The number of sets');
        expect(sets[0].minimum).to.eql(0, 'The minimum score of set')
        expect(sets[0].maximum).to.eql(100, 'The maximum score of set')
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
        expect(response).to.eql('OK', 'The response of the \'iset.del\' command');
        const sets = await client.get('ages');
        expect(sets.length).to.eql(1, 'The sets count')
        response = await client.del('ages')
        expect(response).to.eql('OK', 'The response of the \'iset.del\' command');
    });
});