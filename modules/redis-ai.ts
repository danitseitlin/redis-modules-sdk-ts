import { Module, RedisModuleOptions } from './module.base'
import * as Redis from 'ioredis';

export class RedisAI extends Module {

    /**
     * Initializing the RedisAI object
     * @param options The options of the Redis database.
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs 
     */
    constructor(options: Redis.RedisOptions, public moduleOptions?: RedisModuleOptions) {
        super(RedisAI.name, options, moduleOptions)
    }

    /**
     * Setting a tensor
     * @param key The tensor's key name 
     * @param type The tensor's data type can be one of: FLOAT , DOUBLE , INT8 , INT16 , INT32 , INT64 , UINT8 or UINT16 
     * @param data The tensor's data (binary/numberic)
     * @param shape One or more dimensions, or the number of elements per axis, for the tensor
     */
    async tensorset(key: string, type: TensorType, shapes: number[], data?: number[] | Buffer[]): Promise<'OK'> {
        try {
            const args: (number | string | Buffer)[] = [key, type];
            shapes.forEach(shape => {args.push(shape.toString())});
            if(data !== undefined) {
                args.push(data instanceof Buffer ? 'BLOB': 'VALUES');
                data.forEach((value: (number | string | Buffer)) => {args.push(value.toString())});
            }
            return await this.sendCommand('AI.TENSORSET', args);  
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving a tensor
     * @param key The tensor's key name
     * @param meta Returns the tensor's metadata 
     * @param format The tensor's reply format can be one of the following (BLOB/VALUES)
     */
    async tensorget(key: string, format?: 'BLOB' | 'VALUES', meta?: boolean): Promise<AITensorInfo | string[] | string> {
        try {
            const args = [key];
            if(meta === true)
                args.push('META');
            if(format !== undefined)
                args.push(format);
            const response = await this.sendCommand('AI.TENSORGET', args);
            return this.handleResponse(response);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Setting a model
     * @param key The model's key name 
     * @param backend The backend of the model
     * @param device The devide of the model
     * @param model The Protobuf-serialized model. Since Redis supports strings up to 512MB, blobs for very large
     * @param options Additional optional parameters
     */
    async modelset(key: string, backend: AIBackend, device: AIDevice, model: Buffer, options?: ModelSetParameters): Promise<'OK'> {
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
            return await this.sendCommand('AI.MODELSET', args.concat(['BLOB', model])); 
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving a model
     * @param key The model's key name 
     * @param meta Will return the model's meta information on backend, device and tag
     * @param blob Will return the model's blob containing the serialized model
     */
    async modelget(key: string, meta?: boolean, blob?: boolean): Promise<AIModel | string[] | string> {
        try {
            const args = [key];
            if(meta === true)
                args.push('META');
            if(blob === true)
                args.push('BLOB');
            const response = await this.sendCommand('AI.MODELGET', args);
            return this.handleResponse(response)
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Deleting a model
     * @param key The model's key name
     */
    async modeldel(key: string): Promise<'OK'> {
        try {
            return await this.sendCommand('AI.MODELDEL', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Running a model
     * @param key The model's key name
     * @param inputs Denotes the beginning of the input tensors keys' list, followed by one or more key names
     * @param outputs Denotes the beginning of the output tensors keys' list, followed by one or more key names
     */
    async modelrun(key: string, inputs: string[], outputs: string[]): Promise<'OK'> {
        try {
            const args = [key, 'INPUTS'].concat(inputs).concat(['OUTPUTS']).concat(outputs);
            return await this.sendCommand('AI.MODELRUN', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Scanning a model
     */
    async modelscan(): Promise<string[][]> {
        try {
            return await this.sendCommand('AI._MODELSCAN', []);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Setting a script
     * @param key The script's key name
     * @param parameters Additional optional parameters
     */
    async scriptset(key: string, parameters: AIScriptSetParameters): Promise<'OK'> {
        try {
            let args = [key, parameters.device];
            if(parameters.tag !== undefined)
                args = args.concat(['TAG', parameters.tag])
            return await this.sendCommand('AI.SCRIPTSET', args.concat(['SOURCE', parameters.script]));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving a script
     * @param key The script's key name
     * @param meta The script's device as a String
     * @param source The script's source code as a String
     */
    async scriptget(key: string, meta?: boolean, source?: boolean): Promise<AIScript | string[] | string> {
        try {
            const args = [key];
            if(meta === true)
                args.push('META');
            if(source === true)
                args.push('SOURCE');
            const response: string[] = await this.sendCommand('AI.SCRIPTGET', args);
            return this.handleResponse(response);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Deleting a script
     * @param key The script's key name
     */
    async scriptdel(key: string): Promise<'OK'> {
        try {
            return await this.sendCommand('AI.SCRIPTDEL', [key]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Running a script
     * @param key The script's key nameb
     * @param functionName The name of the function to run
     * @param inputs Denotes the beginning of the input tensors keys' list, followed by one or more key names; variadic arguments are supported by prepending the list with $ , in this case the script is expected an argument of type List[Tensor] as its last argument
     * @param outputs Denotes the beginning of the output tensors keys' list, followed by one or more key names
     */
    async scriptrun(key: string, functionName: string, inputs: string[], outputs: string[]): Promise<'OK'> {
        try {
            const args = [key, functionName, 'INPUTS'].concat(inputs)
            args.push('OUTPUTS')
            return await this.sendCommand('AI.SCRIPTRUN', args.concat(outputs));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Scanning a script
     */
    async scriptscan(): Promise<string[][]> {
        try {
            return await this.sendCommand('AI._SCRIPTSCAN')
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Running a DAG
     * @param commands The commands sent to the DAG
     * @param load An optional argument, that denotes the beginning of the input tensors keys' list, followed by the number of keys, and one or more key names
     * @param persist An optional argument, that denotes the beginning of the output tensors keys' list, followed by the number of keys, and one or more key names
     */
    async dagrun(commands: string[], load?: AIDagrunParameters, persist?: AIDagrunParameters): Promise<string[]> {
        try {
            return await this.sendCommand('AI.DAGRUN', this.generateDagRunArguments(commands, load, persist))
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Running a readonly DAG
     * @param commands The commands sent to the DAG
     * @param load An optional argument, that denotes the beginning of the input tensors keys' list, followed by the number of keys, and one or more key names
     */
    async dagrunRO(commands: string[], load?: AIDagrunParameters): Promise<string[]> {
        try {
            return await this.sendCommand('AI.DAGRUN_RO', this.generateDagRunArguments(commands, load))
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Generating the dagrun CLI arguments
     * @param commands The given commands
     * @param load The given load
     * @param persist The given persist
     */
    private generateDagRunArguments(commands: string[], load?: AIDagrunParameters, persist?: AIDagrunParameters): string[] {
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

    /**
     * Retrieving script/model info
     * @param key The key name of a model or script 
     * @param RESETSTAT Resets all statistics associated with the key 
     */
    async info(key: string, RESETSTAT?: boolean): Promise<AIScriptInfo | string[] | string> {
        try {
            const args = [key]
            if(RESETSTAT === true) args.push('RESETSTAT')
            const response: string[] = await this.sendCommand('AI.INFO', args)
            return this.handleResponse(response);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Restrieving configuration
     * @param path Specifies the default base backends path to path . The backends path is used when dynamically loading a backend (default: '{module_path}/backends', where module_path is the module's path).
     * @param backend  Loads the DL/ML backend specified by the backend identifier from path . If path is relative, it is resolved by prefixing the BACKENDSPATH to it. If path is absolute then it is used as is.
     */
    async config(path: string, backend?: AIBackend): Promise<'OK'> {
        try {
            let args: string[] = []
            if(backend !== undefined)
                args = args.concat(['LOADBACKEND', backend, path])
            else
                args = args.concat(['BACKENDSPATH', path])
            return await this.sendCommand('AI.CONFIG', args)
        }
        catch(error) {
            return this.handleError(error);
        }
    }
}

/**
 * The available tensor types
 */
export type TensorType = 'FLOAT' | 'DOUBLE' | 'INT8' | 'INT16' | 'INT32' | 'INT64' | 'UINT8' | 'UINT16';

/**
 * The model set parameters
 * @param tag The tag of the model
 * @param batch The batch of the model
 * @param size The size of the model
 * @param minSize The min size of the model
 * @param inputs The inputs of the model
 * @param outputs The outputs of the model
 */
export type ModelSetParameters = {
    tag?: string,
    batch?: {
        size: string,
        minSize?: string
    },
    inputs?: string[],
    outputs?: string[],
}

/**
 * The available backend types
 * @param TF The TensorFlow backend
 * @param TFLITE The TensorFlow Lite backend
 * @param TORCH The PyTorch backend
 * @param ONNX The ONNX backend
 */
export type AIBackend = 'TF' | 'TFLITE' | 'TORCH' | 'ONNX';

/**
 * The available device types
 * @param CPU The CPU device
 * @param GPU The GPU device
 */
export type AIDevice = 'CPU' | 'GPU' | string

/**
 * The script set parameters
 * @param device The device of the script
 * @param tag The tag of the script
 * @param script The script name of the script
 */
export type AIScriptSetParameters = {
    device: string,
    tag?: string,
    script: string
}

/**
 * The dagrun object
 * @param keyCount The key count of the dagrun
 * @param keys The keys of the dagrun
 */
export type AIDagrunParameters = {
    keyCount: number,
    keys: string[]
}

/**
 * The model object
 * @param backend The backend of the model
 * @param device The device of the model
 * @param tag The tag of the model
 * @param batchsize The batch size of the model
 * @param minbatchsize The min batch size of the model
 * @param inputs The inputs of the model
 * @param outputs The outputs of the model
 */
export type AIModel = {
    backend?: AIBackend,
    device?: AIDevice,
    tag?: string,
    batchsize?: number,
    minbatchsize?: number,
    inputs?: string[],
    outputs?: string[]
}

/**
 * The tensor object
 * @param blob The blob of the tensor
 */
export interface AITensor extends AIModel{
    blob?: string
}

/**
 * The script object
 * @param device The device of the script
 * @param tag The tag of the script
 * @param source The source of the script
 */
export type AIScript = {
    device?: AIDevice,
    tag?: string,
    source?: string
}

/**
 * The script information object
 * @param key The key of the script
 * @param type The type of the script
 * @param backend The backend of the script
 * @param duration The duration of the script
 * @param samples The samples of the script
 * @param calls The calls of the script
 * @param errors The errors of the script
 */
export interface AIScriptInfo extends AIScript {
    key?: string,
    type?: string,
    backend?: string,
    duration?: number,
    samples?: number,
    calls?: number,
    errors?: number
}

/**
 * The tensor information object
 * @param dtype The tensor's data type can be one of: FLOAT , DOUBLE , INT8 , INT16 , INT32 , INT64 , UINT8 or UINT16
 * @param shape One or more dimensions, or the number of elements per axis, for the tensor
 * @param values Indicates that data is numeric and is provided by one or more subsequent val arguments
 * @param blob Indicates that data is in binary format and is provided via the subsequent data argument
 */
export type AITensorInfo = {
    dtype?: TensorType,
    shape?: string[],
    values?: string[],
    blob?: string
}