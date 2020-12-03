import { Module } from './module.base'
import * as Redis from 'ioredis';

export class RedisAI extends Module {

    /**
     * Initializing the RedisAI object
     * @param options The options of the Redis database.
     */
    constructor(options: Redis.RedisOptions) {
        super(options)
    }

    //TBD, not sure how.
    async tensorset(key: string, type: TensorType, data: string | string[]) {
        let args = [key, type];
        if(typeof data === 'string')
            args = args.concat(['BLOB', data]);
        else if(typeof data === 'object')
            args = args.concat(['VALUES'].concat(data));
        return await this.redis.send_command('AI.TENSORSET', args);
    }

    /**
     * 
     * @param key 
     * @param meta 
     * @param format 
     */
    async tensorget(key: string, meta?: boolean, format?: 'BLOB' | 'VALUES') {
        const args = [key];
        if(meta === true)
            args.push('META');
        if(format !== undefined)
            args.push(format);
        return await this.redis.send_command('AI.TENSORGET', args);
    }
    async modelset(key: string, backend: ModelSetBackend, device: ModelSetDevice, model: string, options?: ModelSetOptions) {
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
    async modelget() {}
    async modeldel() {}
    async modelrun() {}
    async modelscan() {}
    async scriptset() {}
    async scriptget() {}
    async scriptdel() {}
    async scriptrun() {}
    async scriptscan() {}
    async dagrun() {}
    async dagrunRO() {}
    async info() {}
    async config() {}
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