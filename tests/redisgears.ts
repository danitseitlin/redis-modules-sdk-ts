import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisGears } from '../modules/redisgears';
let client: RedisGears;

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
        const response = await client.pyexecute('"GB().run()"', {
            unblocking: true
        })
        console.log(response)
    });
    /*it('abortExecution function', async () => {
        const response = await client.abortExecution()
        console.log(response)
    });
    it('configGet function', async () => {
        const response = await client.configGet('')
        console.log(response)
    });
    it('configSet function', async () => {
        const response = await client.configSet('')
        console.log(response)
    });
    it('dropExecution function', async () => {
        const response = await client.dropExecution('')
        console.log(response)
    });
    it('dumpExecutions function', async () => {
        const response = await client.dumpExecutions('')
        console.log(response)
    });
    it('getExecution function', async () => {
        const response = await client.getExecution('')
        console.log(response)
    });
    it('getResults function', async () => {
        const response = await client.getResults('')
        console.log(response)
    });
    it('getResultsBlocking function', async () => {
        const response = await client.getResultsBlocking('')
        console.log(response)
    });
    it('infocluster function', async () => {
        const response = await client.infocluster('')
        console.log(response)
    });
    
    it('pystats function', async () => {
        const response = await client.pystats('')
        console.log(response)
    });
    it('pydumpreqs function', async () => {
        const response = await client.pydumpreqs('')
        console.log(response)
    });
    it('refreshcluster function', async () => {
        const response = await client.refreshcluster('')
        console.log(response)
    });
    it('trigger function', async () => {
        const response = await client.trigger('')
        console.log(response)
    });
    it('unregister function', async () => {
        const response = await client.unregister('')
        console.log(response)
    });*/
});