import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisModules } from '../';
let redis: RedisModules;

describe('RedisIntervalSets Module testing', async function() {
    before(async () => {
        redis = new RedisModules({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        }, { showDebugLogs: true });
        await redis.connect();
    })
    after(async () => {
        await redis.disconnect();
    })

    it('add function', async () => {
        const response = await redis.ris_module_add('ages', [{
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
        let sets = await redis.ris_module_get('ages')
        expect(sets.length).to.eql(2, 'The number of sets');
        sets = await redis.ris_module_get('ages', 'kids')
        expect(sets.length).to.eql(1, 'The number of sets');
        expect(sets[0].minimum).to.eql(0, 'The minimum score of set')
        expect(sets[0].maximum).to.eql(100, 'The maximum score of set')
    });

    it('score function', async () => {
        let sets = await redis.ris_module_score('ages', 5)
        expect(sets.length).to.eql(1, 'The number of sets');
        expect(sets[0]).to.eql('kids', 'The name of the set');

        sets = await redis.ris_module_score('ages', 5)
        expect(sets.length).to.eql(1, 'The number of sets');
        expect(sets[0]).to.eql('kids', 'The name of the set');
    });

    it('notScore function', async () => {
        let sets = await redis.ris_module_notScore('ages', 5)
        expect(sets.length).to.eql(1, 'The number of sets');
        expect(sets[0]).to.eql('parents', 'The name of the set');

        sets = await redis.ris_module_notScore('ages', 5)
        expect(sets.length).to.eql(1, 'The number of sets');
        expect(sets[0]).to.eql('parents', 'The name of the set');
    });

    it('del function', async () => {
        let response = await redis.ris_module_del('ages', ['kids'])
        expect(response).to.eql('OK', 'The response of the \'iset.del\' command');
        const sets = await redis.ris_module_get('ages');
        expect(sets.length).to.eql(1, 'The sets count')
        response = await redis.ris_module_del('ages')
        expect(response).to.eql('OK', 'The response of the \'iset.del\' command');
    });
});