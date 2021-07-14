import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Module } from '../modules/module.base';
const clients: Module[] = []
describe('Module base testing', async function() {
    before(async () => {
        clients.push(new Module('Module', {
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        }, { isHandleError: false }));
        /*clients.push(new Module('Module', [{
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        }], { isHandleError: false }));*/
        for(const client of clients)
            await client.connect()
    })
    after(async() => {
        for(const client of clients)
            await client.disconnect()
    })

    it('sendCommand function', async() => {
        //const clients = [redisClient/*, clusterClient*/];
        for(const client of clients) {
            //await client.connect()
            let response = await client.sendCommand('set', ['foo', 'bar'])
            expect(response).to.equal('OK', 'The response of the SET command')
            response = await client.sendCommand('get', ['foo'])
            expect(response).to.equal('bar', 'The response of the GET command')
            response = await client.sendCommand('del', ['foo'])
            expect(response).to.equal('1', 'The response of the DEL command')
            //await client.disconnect()
        }
    })

    /*it('handleResponse function', async () => {
        let response: any = 'OK';
        let parsed = redisClient.handleResponse(response)
        expect(parsed).to.equal(response, 'The parsed response')
        response = ['key', 'value', 'key2', 'value2'];
        parsed = redisClient.handleResponse(response)
        expect(parsed.key).to.equal(response[1], 'The parsed response')
        expect(parsed.key2).to.equal(response[3], 'The parsed response')
        response = [
            'numbers', ['num1', 2]
        ];
        parsed = redisClient.handleResponse(response)
        expect(parsed.numbers.num1).to.equal(response[1][1], 'The parsed response')
        console.log(redisClient.handleResponse([
            'key',
            1,
            'fields',
            [
                [1,2,3],
                [3,4,5]
            ]
        ]))

        console.log(redisClient.handleResponse([ [ 'TERM', 'name', [] ] ]))
    });

    it('isOnlyTwoDimensionalArray function', async () => {
        let response = [
            [1, 2, 3],
            1
        ]
        expect(response).to.equal(false, 'If array is two dimensional')
        response = [
            [1, 2, 3],
            [6]
        ]
        expect(response).to.equal(true, 'If array is two dimensional')
    })*/
})