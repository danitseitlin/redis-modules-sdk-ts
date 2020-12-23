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

    //TBD, not sure how.
    async tensorset(key: string, type: TensorType, data: string | string[]) {
        try {
            let args = [key, type];
            if(typeof data === 'string')
                args = args.concat(['BLOB', data]);
            else if(typeof data === 'object')
                args = args.concat(['VALUES'].concat(data));
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
    async tensorget(key: string, meta?: boolean, format?: 'BLOB' | 'VALUES') {
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
    async modelset(key: string, backend: ModelSetBackend, device: ModelSetDevice, model: string, options?: ModelSetOptions) {
        try {
            let args = [key, backend, device];
            if(options !== undefined) {
                if(options.tag !== undefined)
                    args = args.concat(['TAG', options.tag]);
                if(options.batch !== undefined) {
                    args = args.concat(['BATCHSIZE', options.batch.size])
                    if(options.batch.minSize !== undefined)
                        args = args.concat(['MINBATCHSIZE', options.batch.minSize]);
                }
                if(options.inputs !== undefined)
                    args = args.concat(['INPUTS'].concat(options.inputs));
                if(options.outputs !== undefined)
                    args = args.concat(['OUTPUTS'].concat(options.outputs));
            }
            return await this.redis.send_command('AI.MODELSET', args.concat(['BLOB', model])); 
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async modelget(key: string, meta?: string, blob?: string) {
        try {
            const args = [key];
            if(meta !== undefined)
                args.push('META');
            if(blob !== undefined)
                args.push('BLOB');
            return await this.redis.send_command('AI.MODELGET', args);
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
    async scriptrun() {
        try {
            
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async scriptscan() {
        try {
            
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async dagrun() {
        try {
            
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async dagrunRO() {
        try {
            
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async info() {
        try {
            
        }
        catch(error) {
            return this.handleError(`${RedisAI.name}: ${error}`);
        }
    }
    async config() {
        try {
            
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