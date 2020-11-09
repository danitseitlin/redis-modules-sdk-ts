import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisGraph } from '../modules/redisgraph';
let client: RedisGraph;
const graphName = 'Test'

describe('RediSearch Module testing', async function() {
    before(async () => {
        client = new RedisGraph({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('query function', async () => {
        const response = await client.query(graphName, 'CREATE (:Person {name: \'Kurt\', age: 27})')
        expect(response).to.equal('OK', 'The response of the GRAPH.QUERY command');
    });
    it('readOnlyQuery function', async () => {
        const response = await client.readOnlyQuery(graphName, 'MATCH (p:Person) WHERE p.age > 80 RETURN p')
        expect(response).to.equal('OK', 'The response of the GRAPH.RO_QUERY command');
    });
    it('profile function', async () => {
        const response = await client.profile(graphName, 'CREATE (:Person {name: \'Kurt\', age: 27})')
        expect(response).to.equal('OK', 'The response of the GRAPH.PROFILE command');
    });
    it('explain function', async () => {
        const response = await client.explain(graphName, 'MATCH (p:Person) WHERE p.age > 80 RETURN p')
        expect(response).to.equal('OK', 'The response of the GRAPH.EXPLAIN command');
    });
    it('slowlog function', async () => {
        const response = await client.slowlog(1)
        expect(response).to.equal('OK', 'The response of the GRAPH.SLOWLOG command');
    });
    it('delete function', async () => {
        const response = await client.delete(graphName)
        expect(response).to.equal('OK', 'The response of the GRAPH.DELETE command');
    });
});