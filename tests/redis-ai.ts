import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import * as fs from 'fs';
import { RedisModules } from '../modules/redis-modules';
import { AIModel, AIScript, AIScriptInfo, AITensorInfo } from '../modules/redis-ai/redis-ai.types';
let redis: RedisModules;
describe('AI testing', async function() {
    before(async () => {
        const clientOptions = {
            host: cliArguments.host,
            port: parseInt(cliArguments.port)
        };
        redis = new RedisModules(clientOptions);
        await redis.connect();
    })
    after(async () => {
        await redis.disconnect();
    })
    it('tensorset function', async () => {
        let response = await redis.ai_module_tensorset('values-key', 'FLOAT', [2, 2], [1, 2 ,3, 4])
        expect(response).to.eql('OK', 'The response of tensorset')
        response = await redis.ai_module_tensorset('blob-key', 'FLOAT', [1], [Buffer.from('1.11111')])
        expect(response).to.eql('OK', 'The response of tensorset')
    });
    it('tensorget function', async () => {
        let response = await redis.ai_module_tensorget('values-key', 'VALUES', true) as AITensorInfo;
        expect(response.dtype).to.eql('FLOAT', 'The dtype of tensor')
        response = await redis.ai_module_tensorget('blob-key', 'BLOB', true) as AITensorInfo
        expect(response.dtype).to.eql('FLOAT', 'The dtype of tensor')
        response = await redis.ai_module_tensorget('blob-key', 'BLOB', true) as AITensorInfo
        expect(response.dtype).to.eql('FLOAT', 'The dtype of tensor')
    });
    it('modelstore function', async () => {
        const file = fs.readFileSync('./tests/data/models/model1.onnx')
        const response = await redis.ai_module_modelstore('blob-model', 'ONNX', 'CPU', file)
        expect(response).to.eql('OK', 'The response of modelset')
    });
    it('modelget function', async () => {
        const modelName = 'blob-model';
        const response = await redis.ai_module_modelget('blob-model', true, true) as AIModel;
        expect(response.device).to.eql('CPU', `The device of key ${modelName}`)
    });
    it('modelexecute function', async () => {
        let response = await redis.ai_module_tensorset('tensorA', 'FLOAT', [1, 2], [2, 3])
        response = await redis.ai_module_tensorset('tensorB', 'FLOAT', [1, 2], [3, 5])
        const blob = fs.readFileSync('./tests/data/models/graph.pb');
        response = await redis.ai_module_modelstore('mymodel', 'TF', 'CPU', blob, {
            inputs: ['a', 'b'],
            inputsCount: 2,
            outputs: ['c'],
            outputsCount: 1
        })
        expect(response).to.eql('OK', 'The response of modelstore')
        response = await redis.ai_module_modelexecute('mymodel', {
            inputs: ['tensorA', 'tensorB'],
            outputs: ['tensorC'],
            inputsCount: 2,
            outputsCount: 1
        })
        expect(response).to.eql('OK', 'The response of modelexecute')
    });
    it('modelscan function', async () => {
        const response = await redis.ai_module_modelscan();
        expect(response[0][0]).to.eql('mymodel', 'The response of mymodel')
    });
    it('modeldel function', async () => {
        const response = await redis.ai_module_modeldel('blob-model');
        expect(response).to.eql('OK', 'The response of modeldel')
    });
    it('scriptset function', async () => {
        const scriptFileStr = fs.readFileSync('./tests/data/scripts/script.txt').toString();
        const response = await redis.ai_module_scriptset('myscript', {
            device: 'CPU',
            script: scriptFileStr
        });
        expect(response).to.eql('OK', 'The response of scriptset')
    });
    it('scriptget function', async () => {
        const scriptName = 'myscript'
        const response = await redis.ai_module_scriptget(scriptName, true, true) as AIScript;
        expect(response.device).to.eql('CPU', `The device of script ${scriptName}`)
    });
    
    it('scriptexecute function', async () => {
        await redis.ai_module_tensorset('tensorA', 'FLOAT', [1, 2], [2, 3]);
        await redis.ai_module_tensorset('tensorB', 'FLOAT', [1, 2], [3, 5]);
        const response = await redis.ai_module_scriptexecute('myscript', 'bar', {
            numberOfKeys: 3,
            keys: ['tensorA', 'tensorB', 'tensorC'],
            numberOfInputs: 2,
            inputs: ['tensorA', 'tensorB'],
            numberOfOutputs: 1,
            outputs: ['tensorC']
        })
        expect(response).to.eql('OK', 'The response of scriptexecute')
    });
    it('scriptscan function', async () => {
        const response = await redis.ai_module_scriptscan();
        expect(response[0][0]).to.eql('myscript', 'The response of scriptscan')
    });
    it('info function', async () => {
        const response: AIScriptInfo = await redis.ai_module_info('myscript') as AIScriptInfo;
        expect(response.key).to.eql('myscript', 'The response of info')
    });
    it('scriptdel function', async () => {
        const response = await redis.ai_module_scriptdel('myscript');
        expect(response).to.eql('OK', 'The response of scriptdel')
    });
    it('config function', async () => {
        const response = await redis.ai_module_config('/usr/lib/redis/modules/backends/')
        expect(response).to.eql('OK', 'The response of config')
    });
    it('dagexecute function', async () => {
        await redis.ai_module_tensorset('tensorA', 'FLOAT', [1, 2], [2, 3]);
        const response = await redis.ai_module_dagexecute({
            type: 'load',
            numberOfKeys: 1,
            keys: ['tensorA']
        }, [
            'AI.TENSORGET tensorA VALUES'
        ])
        expect(response).to.eql([
            [
                "2",
                "3"
            ]
        ], 'The response of dagexecute')
    });
    it('dagexecuteRO function', async () => {
        await redis.ai_module_tensorset('tensorA', 'FLOAT', [1, 2], [2, 3]);
        const response = await redis.ai_module_dagexecuteRO({
            type: 'load',
            numberOfKeys: 1,
            keys: ['tensorA']
        }, [
            'AI.TENSORGET tensorA VALUES'
        ])
        expect(response).to.eql([
            [
                "2",
                "3"
            ]
        ], 'The response of dagexecute_RO')
    });
})