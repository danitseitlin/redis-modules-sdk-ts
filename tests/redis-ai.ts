import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisAI } from '../modules/redis-ai';
let client: RedisAI;
const key1 = 'key1cmk'
const key2 = 'key1cmk2';

describe('AI testing', async function() {
    before(async () => {
        client = new RedisAI({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })

    it('tensorset function', async () => {
        let response = await client.tensorset('my-key', 'DOUBLE', ['1.1'])
        expect(response).eql('OK', 'The response of tensorset')
        response = await client.tensorset('my-key2', 'DOUBLE', [Buffer.from('1.1')])
        expect(response).eql('OK', 'The response of tensorset')
    });
    it('tensorget function', async () => {
        let response = await client.tensorget('my-key', 'VALUES')
        console.log(response)
        response = await client.tensorget('my-key', 'BLOB')
        console.log(response)
    });
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //it(' function', async () => {
    //    
    //});
    //
});