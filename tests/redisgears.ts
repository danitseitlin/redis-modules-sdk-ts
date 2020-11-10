import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisGears } from '../modules/redisgears';
let client: RedisGears;
let executionId1: string;
let executionId2: string;
let executionId3: string;
describe('RediGears Module testing', async function() {
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
        console.log(`Execution ID: ${executionId1}`)
        executionId2 = await client.pyexecute('GB().run()', {
            unblocking: true
        })
        console.log(`Execution ID: ${executionId2}`)
        executionId3 = await client.pyexecute('GB(\'CommandReader\').register(trigger=\'mytrigger\')', {
            unblocking: true
        })
    });
    it('configSet function', async () => {
        const response = await client.configSet([['ProfileExecutions', '1']])
        console.log(response)
    });
    it('configGet function', async () => {
        const response = await client.configGet(['ProfileExecutions'])
        console.log(response)
    });
    it('getExecution function', async () => {
        const response = await client.getExecution(executionId1)
        console.log(response)
    });
    
    it('dumpExecutions function', async () => {
        const response = await client.dumpExecutions()
        console.log(response)
    });
    it('dumpRegistrations function', async () => {
        const response = await client.dumpRegistrations()
        console.log(response)
    });
    
    it('getResults function', async () => {
        const response = await client.getResults(executionId1)
        console.log(response)
    });
    it('getResultsBlocking function', async () => {
        const response = await client.getResultsBlocking(executionId1)
        console.log(response)
    });
    it('infocluster function', async () => {
        const response = await client.infocluster()
        console.log(response)
    });
    
    it('pystats function', async () => {
        const response = await client.pystats()
        console.log(response)
    });
    it('pydumpreqs function', async () => {
        const response = await client.pydumpreqs()
        console.log(response)
    });
    it('refreshCluster function', async () => {
        const response = await client.refreshCluster()
        console.log(response)
    });
    it('trigger function', async () => {
        const response = await client.trigger('mytrigger', ['foo', 'bar'])
        console.log(response)
    });
    it('dropExecution function', async () => {
        const response = await client.dropExecution(executionId1)
        console.log(response)
    });
    it('abortExecution function', async () => {
        const response = await client.abortExecution(executionId2)
        console.log(response)
    });
    it('unregister function', async () => {
        const response = await client.unregister(executionId3)
        console.log(response)
    });
});