import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { Module } from '../modules/module.base';
let client: Module;

describe('AI testing', async function() {
    before(async () => {
        client = new Module('Module', {
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        }, false);
    })

    it('handleResponse function', async () => {
        let response: any = 'OK';
        let parsed = client.handleResponse(response)
        expect(parsed).to.equal(response, 'The parsed response')
        response = ['key', 'value', 'key2', 'value2'];
        parsed = client.handleResponse(response)
        expect(parsed.key).to.equal(response[1], 'The parsed response')
        expect(parsed.key2).to.equal(response[3], 'The parsed response')
        response = [
            'numbers', ['num1', 2]
        ];
        parsed = client.handleResponse(response)
        expect(parsed.numbers.num1).to.equal(response[1][1], 'The parsed response')
        console.log(client.handleResponse([
            'key',
            1,
            'fields',
            [
                [1,2,3],
                [3,4,5]
            ]
        ]))

        console.log(client.handleResponse([ [ 'TERM', 'name', [] ] ]))
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
    })
})