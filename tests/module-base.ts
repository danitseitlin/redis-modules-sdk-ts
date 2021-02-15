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
        const response1 = 'OK';
        console.log(client.handleResponse(response1))
        const response2 = ['Key', 'Value', 'Key2', 'Value2'];
        console.log(client.handleResponse(response2))
        const response3 = [
            'numbers', ['num1', 2]
        ];
        console.log(client.handleResponse(response3))
    });
})