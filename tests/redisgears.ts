import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisGears } from '../modules/redisgears';
let client: RedisGears;
let executionId1: string;
let executionId2: string;
let executionId3: string;
describe('RedisGears Module testing', async function() {
    before(async () => {
        client = new RedisGears({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('pyexecute function', async () => {
        executionId1 = await client.pyexecute('GB().run()', {
            unblocking: true
        })
        expect(executionId1).to.equal('0000000000000000000000000000000000000000-0', 'The execution id')
        console.log(`Execution ID: ${executionId1}`)
        executionId2 = await client.pyexecute('GB().run()', {
            unblocking: true
        })
        console.log(`Execution ID: ${executionId2}`)
        expect(executionId2).to.equal('0000000000000000000000000000000000000000-1', 'The execution id')
        executionId3 = await client.pyexecute('GB().run()', {
            unblocking: true
        })
        console.log(`Execution ID: ${executionId3}`)
        expect(executionId3).to.equal('0000000000000000000000000000000000000000-2', 'The execution id')
    });
    it('configSet function', async () => {
        const response = await client.configSet([['ProfileExecutions', '1']])
        expect(response.length).to.equal(0, 'The response count of the \'RG.CONFIGSET\' Command');
    });
    it('configGet function', async () => {
        const response = await client.configGet(['ProfileExecutions'])
        expect(response[0]).to.equal(0, 'The response count of the \'RG.CONFIGGET\' Command');
    });
    it('getExecution function', async () => {
        const response = await client.getExecution(executionId1)
        expect(response[0][3][1]).to.equal('done', 'The response count of the \'RG.GETRESULTS\' Command')
    });
    
    it('dumpExecutions function', async () => {
        const response = await client.dumpExecutions()
        expect(response[1][1]).to.equal(executionId1, 'The execution id')
        expect(response[0][1]).to.equal(executionId2, 'The execution id')
    });
    it('dumpRegistrations function', async () => {
        const response = await client.dumpRegistrations()
        expect(response.length).to.equal(0, 'The response count of the \'RG.DUMPREGISTRATIONS\' Command')
    });
    
    it('getResults function', async () => {
        const response = await client.getResults(executionId1)
        console.log(response)
        expect(response.length).to.equal(2, 'The response count of the \'RG.GETRESULTS\' Command')
    });
    it('getResultsBlocking function', async () => {
        const response = await client.getResultsBlocking(executionId1)
        expect(response.length).to.equal(2, 'The response count of the \'RG.GETRESULTSBLOCKING\' Command')
    });
    it('infocluster function', async () => {
        const response = await client.infocluster()
        expect(response).to.equal('no cluster mode', 'The response of the \'RG.INFOCLUSTER\' Command')
    });
    
    it('pystats function', async () => {
        const response = await client.pystats()
        expect(response[0]).to.equal('TotalAllocated', 'The response of the \'RG.PYSTATS\' Command')
    });
    it('pydumpreqs function', async () => {
        const response = await client.pydumpreqs()
        expect(response.length).to.equal(0, 'The response of the \'RG.PYDUMPREQS\' Command')
    });
    it('refreshCluster function', async () => {
        const response = await client.refreshCluster()
        expect(response).to.equal('OK', 'The response of the \'RG.REFRESHCLUSTER\' Command')
    });
    it('trigger function', async () => {
        await client.pyexecute("GB('CommandReader').register(trigger='mytrigger')", {
            unblocking: true
        })
        const response = await client.trigger('mytrigger', ['foo', 'bar'])
        expect(response[0]).to.equal('[\'mytrigger\', \'foo\', \'bar\']', 'The response of the \'RG.DROPEXECUTION\' Command')
    });
    it('dropExecution function', async () => {
        const response = await client.dropExecution(executionId1)
        expect(response).to.equal('OK', 'The response of the \'RG.DROPEXECUTION\' Command')
    });
    it('abortExecution function', async () => {
        const response = await client.abortExecution(executionId2)
        expect(response).to.equal('OK', 'The response of the \'RG.ABORTEXECUTION\' Command')
    });
    it('unregister function', async () => {
        executionId3 = await client.pyexecute('GB().register()', {
            unblocking: true
        })
        const response = await client.unregister(executionId3)
        console.log(response)
    });
});