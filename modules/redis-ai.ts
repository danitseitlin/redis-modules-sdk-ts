import { Module } from './module.base'
import * as Redis from 'ioredis';

export class RedisAI extends Module {

    /**
     * Initializing the RedisAI object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: Redis.RedisOptions, throwError = true) {
        super(options, throwError)
    }

    /**
     * 
     * @param key 
     * @param type 
     * @param data 
     * @param shape 
     */
    async tensorset(key: string, type: TensorType, shapes: number[], data?: number[] | Buffer[]): Promise<void> {
        try {
            const args: (number | string | Buffer)[] = [key, type];
            shapes.forEach(shape => {args.push(shape.toString())});
            if(data !== undefined) {
                args.push(data instanceof Buffer ? 'BLOB': 'VALUES');
                data.forEach((value: (number | string | Buffer)) => {args.push(value.toString())});
            }
            return await this.redis.send_command('AI.TENSORSET', args);  
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }

    /**
     * 
     * @param key 
     * @param meta 
     * @param format 
     */
    async tensorget(key: string, format?: 'BLOB' | 'VALUES', meta?: boolean) {
        try {
            const args = [key];
            if(meta === true)
                args.push('META');
            if(format !== undefined)
                args.push(format);
            return await this.redis.send_command('AI.TENSORGET', args); 
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async modelset(key: string, backend: ModelSetBackend, device: ModelSetDevice, model: Buffer, options?: ModelSetOptions) {
        try {
            let args: (string | Buffer)[] = [key, backend, device];
            if(options !== undefined) {
                if(options.tag !== undefined)
                    args = args.concat(['TAG', options.tag]);
                if(options.batch !== undefined) {
                    args = args.concat(['BATCHSIZE', options.batch.size])
                    if(options.batch.minSize !== undefined)
                        args = args.concat(['MINBATCHSIZE', options.batch.minSize]);
                }
                if(options.inputs !== undefined && options.inputs.length > 0)
                    args = args.concat(['INPUTS'].concat(options.inputs));
                if(options.outputs !== undefined && options.outputs.length > 0)
                    args = args.concat(['OUTPUTS'].concat(options.outputs));
            }
            return await this.redis.send_command('AI.MODELSET', args.concat(['BLOB', model])); 
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async modelget(key: string, meta?: boolean, blob?: boolean) {
        try {
            const args = [key];
            if(meta !== undefined)
                args.push('META');
            if(blob !== undefined)
                args.push('BLOB');
            const response = await this.redis.send_command('AI.MODELGET', args);
            const outputItems = ['backend', 'device', 'tag', 'batchsize', 'minbatchsize', 'inputs', 'outputs'];
            const outputObject = {};
            outputItems.forEach(item => {
                const index = response.findIndex(outputItem => outputItem === item);
                outputObject[item] = response[index+1];
            });
            return outputObject
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async modeldel(key: string) {
        try {
            return await this.redis.send_command('AI.MODELDEL', [key]);
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async modelrun(key: string, inputs: string[], outputs: string[]) {
        try {
            const args = [key, 'INPUTS'].concat(inputs).concat(['OUTPUTS']).concat(outputs);
            return await this.redis.send_command('AI.MODELRUN', args);
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async modelscan() {
        try {
            return await this.redis.send_command('AI._MODELSCAN', []);
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async scriptset(key: string, parameters: AIScriptSetParameters) {
        try {
            let args = [key, parameters.device];
            if(parameters.tag !== undefined)
                args = args.concat(['TAG', parameters.tag])
            parameters.script = parameters.script.indexOf('"') === -1 ? `"${parameters.script}"`: parameters.script; 
            return await this.redis.send_command('AI.SCRIPTSET', args.concat(['SOURCE', parameters.script]));
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async scriptget(key: string, meta?: string, source?: string) {
        try {
            const args = [key];
            if(meta !== undefined)
                args.push('META');
            if(source !== undefined)
                args.push('SOURCE');
            return await this.redis.send_command('AI.SCRIPTGET', args);
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async scriptdel(key: string): Promise<'OK'> {
        try {
            return await this.redis.send_command('AI.SCRIPTDEL', [key]);
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async scriptrun(key: string, functionName: string, inputs: string[], outputs: string[]): Promise<'OK'> {
        try {
            return await this.redis.send_command('AI.SCRIPTRUN', [key, functionName].concat(inputs).concat(outputs));
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async scriptscan() {
        try {
            return await this.redis.send_command('AI._SCRIPTSCAN')
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async dagrun(commands: string[], load?: AIDagrunOarameters, persist?: AIDagrunOarameters) {
        try {
            //let args: string[] = [];
            //if(load !== undefined){
            //    args = args.concat(['LOAD', load.keyCount.toString()].concat(load.keys))
            //}
            //if(persist !== undefined){
            //    args = args.concat(['PERSIST', persist.keyCount.toString()].concat(persist.keys))
            //}
            //commands.forEach(command => {
            //    args = args.concat([command, '|>'])
            //});
            return await this.redis.send_command('AI.DAGRUN', this.generateDagrun(commands, load, persist))
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async dagrunRO(commands: string[], load?: AIDagrunOarameters) {
        try {
            //let args: string[] = [];
            //if(load !== undefined){
            //    args = args.concat(['LOAD', load.keyCount.toString()].concat(load.keys))
            //}
            return await this.redis.send_command('AI.DAGRUN_RO', this.generateDagrun(commands, load))
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    private generateDagrun(commands: string[], load?: AIDagrunOarameters, persist?: AIDagrunOarameters) {
        let args: string[] = [];
        if(load !== undefined){
            args = args.concat(['LOAD', load.keyCount.toString()].concat(load.keys))
        }
        if(persist !== undefined){
            args = args.concat(['PERSIST', persist.keyCount.toString()].concat(persist.keys))
        }
        commands.forEach(command => {
            args = args.concat([command, '|>'])
        });
        return args
    }
    async info(key: string, RESETSTAT?: boolean) {
        try {
            const args = [key]
            if(RESETSTAT === true) args.push('RESETSTAT')
            return await this.redis.send_command('AI.INFO', args)
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }

    /**
     * 
     * @param path 
     * @param backend 
     */
    async config(path: string, backend?: 'TF' | 'TFLITE' | 'TORCH' | 'ONNX'): Promise<'OK'> {
        try {
            let args: string[] = []
            if(backend !== undefined)
                args = args.concat(['LOADBACKEND', backend, path])
            else
                args = args.concat(['BACKENDSPATH', path])
            return await this.redis.send_command('AI.CONFIG', args)
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
}

export type TensorType = 'FLOAT' | 'DOUBLE' | 'INT8' | 'INT16' | 'INT32' | 'INT64' | 'UINT8' | 'UINT16';

export type ModelSetOptions = {
    tag?: string,
    batch?: {
        size: string,
        minSize?: string
    },
    inputs?: string[],
    outputs?: string[],
}

export type ModelSetBackend = 'TF' | 'TFLITE' | 'TORCH' | 'ONNX';
export type ModelSetDevice = 'CPU' | 'GPU' | string

export type AIScriptSetParameters = {
    device: string,
    tag?: string,
    script: string
}

export type AIDagrunOarameters = {
    keyCount: number,
    keys: string[]
}