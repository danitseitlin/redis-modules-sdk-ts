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
        const args: (number | string | Buffer)[] = [key, type];
        shapes.forEach(shape => {args.push(shape.toString())});
        if(data !== undefined) {
            args.push(data instanceof Buffer ? 'BLOB': 'VALUES');
            data.forEach((value: (number | string | Buffer)) => {args.push(value.toString())});
        }
        return await this.sendCommand('AI.TENSORSET', args);
    }

    /**
     * Retrieving a tensor
     * @param key The tensor's key name
     * @param meta Returns the tensor's metadata 
     * @param format The tensor's reply format can be one of the following (BLOB/VALUES)
     */
    async tensorget(key: string, format?: 'BLOB' | 'VALUES', meta?: boolean): Promise<AITensorInfo | string[] | string> {
        const args = [key];
        if(meta === true)
            args.push('META');
        if(format !== undefined)
            args.push(format);
        const response = await this.sendCommand('AI.TENSORGET', args);
        return this.handleResponse(response);
    }

    /**
     * Setting a model
     * @param key The model's key name 
     * @param backend The backend of the model
     * @param device The devide of the model
     * @param model The Protobuf-serialized model. Since Redis supports strings up to 512MB, blobs for very large
     * @param options Additional optional parameters
     */
    async modelstore(key: string, backend: AIBackend, device: AIDevice, model: Buffer, options?: AIModelSetParameters): Promise<'OK'> {
        let args: (string | Buffer | number)[] = [key, backend, device];
        if(options !== undefined) {
            if(options.tag !== undefined)
                args = args.concat(['TAG', options.tag]);
            if(options.batch !== undefined) {
                args = args.concat(['BATCHSIZE', options.batch.size])
                if(options.batch.minSize !== undefined)
                    args = args.concat(['MINBATCHSIZE', options.batch.minSize]);
            }
            if(options.inputs !== undefined && options.inputs.length > 0)
                args = args.concat(['INPUTS', options.inputsCount].concat(options.inputs));
            if(options.outputs !== undefined && options.outputs.length > 0)
                args = args.concat(['OUTPUTS', options.outputsCount].concat(options.outputs));
        }
        return await this.sendCommand('AI.MODELSTORE', args.concat(['BLOB', model])); 
    }

    /**
     * Retrieving a model
     * @param key The model's key name 
     * @param meta Will return the model's meta information on backend, device and tag
     * @param blob Will return the model's blob containing the serialized model
     */
    async modelget(key: string, meta?: boolean, blob?: boolean): Promise<AIModel | string[] | string> {
        const args = [key];
        if(meta === true)
            args.push('META');
        if(blob === true)
            args.push('BLOB');
        const response = await this.sendCommand('AI.MODELGET', args);
        return this.handleResponse(response)
    }

    /**
     * Deleting a model
     * @param key The model's key name
     */
    async modeldel(key: string): Promise<'OK'> {
        return await this.sendCommand('AI.MODELDEL', [key]);
    }

    /**
     * Running a model
     * @param key The model's key name
     * @param parameters The parameters of 'AI.MODELEXECUTE'
     */
    async modelexecute(key: string, parameters: AIModelExecute): Promise<'OK'> {
        const args = [key, 'INPUTS', parameters.inputsCount].concat(parameters.inputs).concat(['OUTPUTS', parameters.outputsCount]).concat(parameters.outputs);
        console.log(args)
        return await this.sendCommand('AI.MODELEXECUTE', args);
    }

    /**
     * Scanning a model
     */
    async modelscan(): Promise<string[][]> {
        return await this.sendCommand('AI._MODELSCAN', []);
    }

    /**
     * Setting a script
     * @param key The script's key name
     * @param parameters Additional optional parameters
     */
    async scriptset(key: string, parameters: AIScriptSetParameters): Promise<'OK'> {
        let args = [key, parameters.device];
        if(parameters.tag !== undefined)
            args = args.concat(['TAG', parameters.tag])
        return await this.sendCommand('AI.SCRIPTSET', args.concat(['SOURCE', parameters.script]));
    }

    /**
     * Retrieving a script
     * @param key The script's key name
     * @param meta The script's device as a String
     * @param source The script's source code as a String
     */
    async scriptget(key: string, meta?: boolean, source?: boolean): Promise<AIScript | string[] | string> {
        const args = [key];
        if(meta === true)
            args.push('META');
        if(source === true)
            args.push('SOURCE');
        const response: string[] = await this.sendCommand('AI.SCRIPTGET', args);
        return this.handleResponse(response);
    }

    /**
     * Deleting a script
     * @param key The script's key name
     */
    async scriptdel(key: string): Promise<'OK'> {
        return await this.sendCommand('AI.SCRIPTDEL', [key]);
    }

    /**
     * Running a script
     * @param key The script's key nameb
     * @param functionName The name of the function to run
     * @param parameters The parameters of the 'AI.SCRIPTEXECUTE' command
    */
    async scriptexecute(key: string, functionName: string, parameters: AIScriptExecuteParameters): Promise<'OK'> {
        let args = [key, functionName, 'KEYS', parameters.numberOfKeys].concat(parameters.keys).concat(['INPUTS', parameters.numberOfInputs]).concat(parameters.inputs)
        if(parameters.listInputs && parameters.listInputs.length > 0 && parameters.numberOfListInputs)
            args = args.concat('LIST_INPUTS', parameters.numberOfListInputs).concat(parameters.listInputs)
        args = args.concat('OUTPUTS', parameters.numberOfOutputs).concat(parameters.outputs)
        if(parameters.timeout)
            args.concat('TIMEOUT', parameters.timeout)
        return await this.sendCommand('AI.SCRIPTEXECUTE', args);
    }

    /**
     * Scanning a script
     */
    async scriptscan(): Promise<string[][]> {
        return await this.sendCommand('AI._SCRIPTSCAN')
    }

    /**
     * Running a DAG
     * @param commands The commands sent to the DAG
     * @param load An optional argument, that denotes the beginning of the input tensors keys' list, followed by the number of keys, and one or more key names
     * @param persist An optional argument, that denotes the beginning of the output tensors keys' list, followed by the number of keys, and one or more key names
     * @param keys An optional argument, that denotes the beginning of keys' list which are used within this command, followed by the number of keys, and one or more key names. Alternately, the keys names list can be replaced with a tag which all of those keys share. Redis will verify that all potential key accesses are done to the right shard.
     */
    async dagexecute(commands: string[], load?: AIDagrunParameters, persist?: AIDagrunParameters, keys?: AIDagrunParameters): Promise<string[]> {
        return await this.sendCommand('AI.DAGEXECUTE', this.generateDagRunArguments(commands, load, persist, keys))
    }

    /**
     * Running a readonly DAG
     * @param commands The commands sent to the DAG
     * @param load An optional argument, that denotes the beginning of the input tensors keys' list, followed by the number of keys, and one or more key names
     */
    async dagexecuteRO(commands: string[], load?: AIDagrunParameters): Promise<string[]> {
        return await this.sendCommand('AI.DAGEXECUTE_RO', this.generateDagRunArguments(commands, load))
    }

    /**
     * Generating the dagexecute CLI arguments
     * @param commands The given commands
     * @param load The given load
     * @param persist The given persist
     * @param keys The given keys
     */
    private generateDagRunArguments(commands: string[], load?: AIDagrunParameters, persist?: AIDagrunParameters, keys?: AIDagrunParameters): string[] {
        let args: string[] = [];
        if(load)
            args = args.concat(['LOAD', load.keyCount.toString()].concat(load.keys))
        if(persist)
            args = args.concat(['PERSIST', persist.keyCount.toString()].concat(persist.keys))
        if(keys)
            args = args.concat(['KEYS', persist.keyCount.toString()].concat(persist.keys))
        commands.forEach(command => {
            args = args.concat(['|>'].concat(command.split(' ')))
        });
        console.log(args)
        return args
    }

    /**
     * Retrieving script/model info
     * @param key The key name of a model or script 
     * @param RESETSTAT Resets all statistics associated with the key 
     */
    async info(key: string, RESETSTAT?: boolean): Promise<AIScriptInfo | string[] | string> {
        const args = [key]
        if(RESETSTAT === true) args.push('RESETSTAT')
        const response: string[] = await this.sendCommand('AI.INFO', args)
        return this.handleResponse(response);
    }

    /**
     * Restrieving configuration
     * @param path Specifies the default base backends path to path . The backends path is used when dynamically loading a backend (default: '{module_path}/backends', where module_path is the module's path).
     * @param backend  Loads the DL/ML backend specified by the backend identifier from path . If path is relative, it is resolved by prefixing the BACKENDSPATH to it. If path is absolute then it is used as is.
     */
    async config(path: string, backend?: AIBackend): Promise<'OK'> {
        let args: string[] = []
        if(backend !== undefined)
            args = args.concat(['LOADBACKEND', backend, path])
        else
            args = args.concat(['BACKENDSPATH', path])
        return await this.sendCommand('AI.CONFIG', args)
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
 * @param inputsCount The inputs count of model
 * @param outputs The outputs of the model
 * @param outputsCount The outputs count of the model
 */
export type AIModelSetParameters = {
    tag?: string,
    batch?: {
        size: string,
        minSize?: string
    },
    inputsCount?: number,
    inputs?: string[],
    outputsCount?: number,
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
 * The dagexecute object
 * @param keyCount The key count of the dagexecute
 * @param keys The keys of the dagexecute
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

/**
 * The AI.MODELEXECUTE additional parameters
 * @param inputsCount A positive number that indicates the number of following input keys
 * @param inputs The given inputs
 * @param outputsCount A positive number that indicates the number of output keys to follow
 * @param outputs The given outputs
 * @param timeout The time (in ms) after which the client is unblocked and a TIMEDOUT string is returned 
 */
export type AIModelExecute = {
    inputsCount: number,
    inputs: string[],
    outputsCount: number,
    outputs: string[],
    timeout?: number
}

/**
 * Additional parameters of the 'AI.SCRIPTEXECUTE' command
 * @param numberOfKeys The number of tensor keys
 * @param keys The tensor keys
 * @param numberOfInputs The number of inputs
 * @param inputs The inputs
 * @param numberOfListInputs Optional. The number of list inputs
 * @param listInputs Optional. The list inputs
 * @param numberOfOutputs The number of outputs
 * @param outputs The outputs
 * @param timeout The time (in ms) after which the client is unblocked and a TIMEDOUT string is returned
 */
export type AIScriptExecuteParameters = {
    numberOfKeys: number,
    keys: string[],
    numberOfInputs: number,
    inputs: string[],
    listInputs?: string[],
    numberOfListInputs?: number,
    numberOfOutputs: number,
    outputs: string[],
    timeout?: number
}