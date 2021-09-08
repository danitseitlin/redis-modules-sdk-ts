/* eslint-disable @typescript-eslint/no-explicit-any */
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
        /*
        Commenting this out until we find a solution for the mock server.
        clients.push(new Module('Module', [{
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
        for(const client of clients) {
            let response = await client.sendCommand({command: 'set', args: ['foo', 'bar']})
            expect(response).to.equal('OK', 'The response of the SET command')
            response = await client.sendCommand({command: 'get', args: ['foo']})
            expect(response).to.equal('bar', 'The response of the GET command')
            response = await client.sendCommand({command: 'del', args: ['foo']})
            expect(response).to.equal(1, 'The response of the DEL command')
        }
    })

    it('handleResponse function', async () => {
        let response: any = 'OK';
        let parsed = clients[0].handleResponse(response)
        expect(parsed).to.equal(response, 'The parsed response')
        response = ['key', 'value', 'key2', 'value2'];
        parsed = clients[0].handleResponse(response)
        expect(parsed.key).to.equal(response[1], 'The parsed response')
        expect(parsed.key2).to.equal(response[3], 'The parsed response')
        response = [
            'numbers', ['num1', 2]
        ];
        parsed = clients[0].handleResponse(response)
        expect(parsed.numbers.num1).to.equal(response[1][1], 'The parsed response')
    });

    it('isOnlyTwoDimensionalArray function', async () => {
        let response = [
            [1, 2, 3],
            1
        ]
        expect(clients[0].isOnlyTwoDimensionalArray(response)).to.equal(false, 'If array is two dimensional')
        response = [
            [1, 2, 3],
            [6]
        ]
        expect(clients[0].isOnlyTwoDimensionalArray(response)).to.equal(true, 'If array is two dimensional')
    })
})