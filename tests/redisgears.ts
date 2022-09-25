import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisModules } from '../modules/redis-modules';
let redis: RedisModules;
let executionId1: string;
let executionId2: string;
let executionId3: string;
describe('RedisGears Module testing', async function() {
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
    
    it('pyexecute function', async () => {
        executionId1 = await redis.gears_module_pyexecute('GB().run()', {
            unblocking: true
        })
        expect(executionId1).to.equal('0000000000000000000000000000000000000000-0', 'The execution id')
        console.log(`Execution ID1: ${executionId1}`)
        executionId2 = await redis.gears_module_pyexecute('GB().run()', {
            unblocking: true
        })
        console.log(`Execution ID2: ${executionId2}`)
        expect(executionId2).to.equal('0000000000000000000000000000000000000000-1', 'The execution id')
        executionId3 = await redis.gears_module_pyexecute('GB().run()', {
            unblocking: true
        })
        console.log(`Execution ID3: ${executionId3}`)
        expect(executionId3).to.equal('0000000000000000000000000000000000000000-2', 'The execution id')
    });
    it('configSet function', async () => {
        const response = await redis.gears_module_configSet([['ProfileExecutions', '1']])
        expect(response.length).to.equal(0, 'The response count of the \'RG.CONFIGSET\' Command');
    });
    it('configGet function', async () => {
        const response = await redis.gears_module_configGet(['ProfileExecutions'])
        expect(response[0]).to.equal(0, 'The response count of the \'RG.CONFIGGET\' Command');
    });
    it('getExecution function', async () => {
        const response = await redis.gears_module_getExecution(executionId1)
        expect(response[0][3][1]).to.equal('done', 'The response count of the \'RG.GETEXECUTION\' Command')
    });
    it('dumpExecutions function', async () => {
        const response = await redis.gears_module_dumpExecutions()
        expect(response[1][1]).to.equal(executionId1, 'The execution id')
        expect(response[0][1]).to.equal(executionId2, 'The execution id')
    });
    it('dumpRegistrations function', async () => {
        const response = await redis.gears_module_dumpRegistrations()
        expect(response.length).to.equal(0, 'The response count of the \'RG.DUMPREGISTRATIONS\' Command')
    });
    it('getResults function', async () => {
        const response = await redis.gears_module_getResults(executionId1)
        expect(response.length).to.equal(2, 'The response count of the \'RG.GETRESULTS\' Command')
    });
    it('getResultsBlocking function', async () => {
        const response = await redis.gears_module_getResultsBlocking(executionId1)
        expect(response.length).to.equal(2, 'The response count of the \'RG.GETRESULTSBLOCKING\' Command')
    });
    it('infocluster function', async () => {
        const response = await redis.gears_module_infocluster()
        expect(response).to.equal('no cluster mode', 'The response of the \'RG.INFOCLUSTER\' Command')
    });
    it('pystats function', async () => {
        const response = await redis.gears_module_pystats()
        expect(response[0]).to.equal('TotalAllocated', 'The response of the \'RG.PYSTATS\' Command')
    });
    it('pydumpreqs function', async () => {
        const response = await redis.gears_module_pydumpreqs()
        expect(response.length).to.equal(0, 'The response of the \'RG.PYDUMPREQS\' Command')
    });
    it('refreshCluster function', async () => {
        const response = await redis.gears_module_refreshCluster()
        expect(response).to.equal('OK', 'The response of the \'RG.REFRESHCLUSTER\' Command')
    });
    it('trigger function', async () => {
        await redis.gears_module_pyexecute("GB('CommandReader').register(trigger='mytrigger')", {
            unblocking: true
        })
        const response = await redis.gears_module_trigger('mytrigger', ['foo', 'bar'])
        expect(response[0]).to.equal('[\'mytrigger\', \'foo\', \'bar\']', 'The response of the \'RG.TRIGGER\' Command')
    });
    it('dropExecution function', async () => {
        const response = await redis.gears_module_dropExecution(executionId1)
        expect(response).to.equal('OK', 'The response of the \'RG.DROPEXECUTION\' Command')
    });
    it('abortExecution function', async () => {
        const response = await redis.gears_module_abortExecution(executionId2)
        expect(response).to.equal('OK', 'The response of the \'RG.ABORTEXECUTION\' Command')
    });
    it.skip('unregister function', async () => {
        const registrationId = `${executionId3.split('-')[0]}-${parseInt(executionId3.split('-')[1])}`
        const response = await redis.gears_module_unregister(registrationId)
        expect(response).to.equal('OK', 'The response of the \'RG.UNREGISTER\' command')
    });
});