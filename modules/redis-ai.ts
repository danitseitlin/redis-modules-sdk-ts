import { Module, RedisModuleOptions } from './module.base'
import * as Redis from 'ioredis';
import { Commander } from './redis-ai.commander';

export class RedisAI extends Module {

    /**
     * 
     */
    private private commander: Commander
    /**
     * Initializing the module object
     * @param name The name of the module
     * @param clusterNodes The nodes of the cluster
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     * @param clusterOptions The options of the clusters
     */
    constructor(clusterNodes: Redis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: Redis.ClusterOptions)
    /**
     * Initializing the module object
     * @param name The name of the module
     * @param redisOptions The options of the redis database
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     */
    constructor(redisOptions: Redis.RedisOptions, moduleOptions?: RedisModuleOptions)
    constructor(options: Redis.RedisOptions & Redis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: Redis.ClusterOptions) {
        super(RedisAI.name, options, moduleOptions, clusterOptions);
        this.commander = new Commander()
    }

    /**
     * Setting a tensor
     * @param key The tensor's key name 
     * @param type The tensor's data type can be one of: FLOAT , DOUBLE , INT8 , INT16 , INT32 , INT64 , UINT8 or UINT16 
     * @param data The tensor's data (binary/numberic)
     * @param shape One or more dimensions, or the number of elements per axis, for the tensor
     */
    async tensorset(key: string, type: TensorType, shapes: number[], data?: number[] | Buffer[]): Promise<'OK'> {
        const command = this.commander.tensorset(key, type, shapes, data);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving a tensor
     * @param key The tensor's key name
     * @param meta Returns the tensor's metadata 
     * @param format The tensor's reply format can be one of the following (BLOB/VALUES)
     */
    async tensorget(key: string, format?: 'BLOB' | 'VALUES', meta?: boolean): Promise<AITensorInfo | string[] | string> {
        const command = this.commander.tensorget(key, format, meta);
        const response = await this.sendCommand(command);
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
        const command = this.commander.modelstore(key, backend, device, model, options)
        return await this.sendCommand(command); 
    }

    /**
     * Retrieving a model
     * @param key The model's key name 
     * @param meta Will return the model's meta information on backend, device and tag
     * @param blob Will return the model's blob containing the serialized model
     */
    async modelget(key: string, meta?: boolean, blob?: boolean): Promise<AIModel | string[] | string> {
        const command = this.commander.modelget(key, meta, blob);
        const response = await this.sendCommand(command);
        return this.handleResponse(response)
    }

    /**
     * Deleting a model
     * @param key The model's key name
     */
    async modeldel(key: string): Promise<'OK'> {
        const command = this.commander.modeldel(key);
        return await this.sendCommand(command);
    }

    /**
     * Running a model
     * @param key The model's key name
     * @param parameters The parameters of 'AI.MODELEXECUTE'
     */
    async modelexecute(key: string, parameters: AIModelExecute): Promise<'OK'> {
        const command = this.commander.modelexecute(key, parameters);
        return await this.sendCommand(command);
    }

    /**
     * Scanning a model
     */
    async modelscan(): Promise<string[][]> {
        const command = this.commander.modelscan();
        return await this.sendCommand(command);
    }

    /**
     * Setting a script
     * @param key The script's key name
     * @param parameters Additional optional parameters
     */
    async scriptset(key: string, parameters: AIScriptSetParameters): Promise<'OK'> {
        const command = this.commander.scriptset(key, parameters);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving a script
     * @param key The script's key name
     * @param meta The script's device as a String
     * @param source The script's source code as a String
     */
    async scriptget(key: string, meta?: boolean, source?: boolean): Promise<AIScript | string[] | string> {
        const command = this.commander.scriptget(key, meta, source);
        const response: string[] = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Deleting a script
     * @param key The script's key name
     */
    async scriptdel(key: string): Promise<'OK'> {
        const command = this.commander.scriptdel(key);
        return await this.sendCommand(command);
    }

    /**
     * Running a script
     * @param key The script's key nameb
     * @param functionName The name of the function to run
     * @param parameters The parameters of the 'AI.SCRIPTEXECUTE' command
    */
    async scriptexecute(key: string, functionName: string, parameters: AIScriptExecuteParameters): Promise<'OK'> {
        const command = this.commander.scriptexecute(key, functionName, parameters);
        return await this.sendCommand(command);
    }

    /**
     * Scanning a script
     */
    async scriptscan(): Promise<string[][]> {
        const command = this.commander.scriptscan();
        return await this.sendCommand(command);
    }

    /**
     * Running a DAG
     * @param parameters Additional parameters required for the 'AI.DAGEXECUTE' command
     * @param commands The commands sent to the 'AI.DAGEXECUTE' command
     */
    async dagexecute(parameters: AIDagExecuteParameters, commands: string[]): Promise<string[]> {
        const command = this.commander.dagexecute(parameters, commands);
        return await this.sendCommand(command)
    }

    /**
     * Running a readonly DAG
     * @param parameters Additional parameters required for the 'AI.DAGEXECUTE_RO' command
     * @param commands The commands sent to the 'AI.DAGEXECUTE_RO' command
     */
    async dagexecuteRO(parameters: AIDagExecuteParameters, commands: string[]): Promise<string[]> {
        const command = this.commander.dagexecuteRO(parameters, commands);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving script/model info
     * @param key The key name of a model or script 
     * @param RESETSTAT Resets all statistics associated with the key 
     */
    async info(key: string, RESETSTAT?: boolean): Promise<AIScriptInfo | string[] | string> {
        const command = this.commander.info(key, RESETSTAT);
        const response: string[] = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Restrieving configuration
     * @param path Specifies the default base backends path to path . The backends path is used when dynamically loading a backend (default: '{module_path}/backends', where module_path is the module's path).
     * @param backend  Loads the DL/ML backend specified by the backend identifier from path . If path is relative, it is resolved by prefixing the BACKENDSPATH to it. If path is absolute then it is used as is.
     */
    async config(path: string, backend?: AIBackend): Promise<'OK'> {
        const command = this.commander.config(path, backend);
        return await this.sendCommand(command);
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
 * The dagexecute parameters
 * @param type The keyword of the command
 * @param keys The keys of the dagexecute
 * @param numberOfKeys The key count of the dagexecute
 * @param timeout Optional. The time (in ms) after which the client is unblocked and a TIMEDOUT string is returned 
 */
export type AIDagExecuteParameters = {
    type: 'load' | 'persist' | 'keys',
    keys: string[],
    numberOfKeys: number,
    timeout?: number
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