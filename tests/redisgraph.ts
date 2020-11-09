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
        const response = await client.query(graphName, 'CREATE (p:Person {name: \'Kurt\', age: 27}) RETURN p')
        expect(response[2][0]).to.equal('Labels added: 1', 'The response of the GRAPH.QUERY command');
        expect(response[2][1]).to.equal('Nodes created: 1', 'The response of the GRAPH.QUERY command');
        expect(response[2][2]).to.equal('Properties set: 2', 'The response of the GRAPH.QUERY command');
        expect(response[2][3]).to.equal('Cached execution: 0', 'The response of the GRAPH.QUERY command');
    });
    it('readOnlyQuery function', async () => {
        const response = await client.readOnlyQuery(graphName, 'MATCH (p:Person) WHERE p.age > 80 RETURN p')
        expect(response[2][0]).to.equal('Cached execution: 0', 'The response of the GRAPH.RO_QUERY command');
    });
    it('profile function', async () => {
        const response = await client.profile(graphName, 'MATCH (p:Person) WHERE p.age > 80 RETURN p')
        expect(response[0]).to.contain('Results | Records produced: 0', 'The response of the GRAPH.QUERY command');
    });
    it('explain function', async () => {
        const response = await client.explain(graphName, 'MATCH (p:Person) WHERE p.age > 80 RETURN p')
        expect(response[0]).to.equal('Results', 'The response of the GRAPH.EXPLAIN command');
        expect(response[1]).to.contain('Project', 'The response of the GRAPH.EXPLAIN command');
        expect(response[2]).to.contain('Filter', 'The response of the GRAPH.EXPLAIN command');
        expect(response[3]).to.contain('Node By Label Scan | (p:Person)', 'The response of the GRAPH.EXPLAIN command');
    });
    it('slowlog function', async () => {
        const response = await client.slowlog(0)
        expect(response.length).to.equal(0, 'The response of the GRAPH.SLOWLOG command');
    });
    it('delete function', async () => {
        const response = await client.delete(graphName)
        expect(response).to.contain('Graph removed', 'The response of the GRAPH.DELETE command');
    });
});