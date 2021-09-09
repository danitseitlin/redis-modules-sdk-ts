import { Module, RedisModuleOptions } from '../module.base'
import * as Redis from 'ioredis';
import { RedisAICommander } from './redis-ai.commander';
import {
    AIBackend, AIDagExecuteParameters, AIDevice, AIModel, AIModelExecute, AIModelSetParameters, AIScript, AIScriptExecuteParameters, AIScriptInfo,
    AIScriptSetParameters, AITensorInfo, TensorType
} from './redis-ai.types';

export class RedisAI extends Module {
    private aiCommander = new RedisAICommander()
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
    }

    /**
     * Setting a tensor
     * @param key The tensor's key name 
     * @param type The tensor's data type can be one of: FLOAT , DOUBLE , INT8 , INT16 , INT32 , INT64 , UINT8 or UINT16 
     * @param data The tensor's data (binary/numberic)
     * @param shape One or more dimensions, or the number of elements per axis, for the tensor
     */
    async tensorset(key: string, type: TensorType, shapes: number[], data?: number[] | Buffer[]): Promise<'OK'> {
        const command = this.aiCommander.tensorset(key, type, shapes, data);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving a tensor
     * @param key The tensor's key name
     * @param meta Returns the tensor's metadata 
     * @param format The tensor's reply format can be one of the following (BLOB/VALUES)
     */
    async tensorget(key: string, format?: 'BLOB' | 'VALUES', meta?: boolean): Promise<AITensorInfo | string[] | string> {
        const command = this.aiCommander.tensorget(key, format, meta);
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
        const command = this.aiCommander.modelstore(key, backend, device, model, options)
        return await this.sendCommand(command); 
    }

    /**
     * Retrieving a model
     * @param key The model's key name 
     * @param meta Will return the model's meta information on backend, device and tag
     * @param blob Will return the model's blob containing the serialized model
     */
    async modelget(key: string, meta?: boolean, blob?: boolean): Promise<AIModel | string[] | string> {
        const command = this.aiCommander.modelget(key, meta, blob);
        const response = await this.sendCommand(command);
        return this.handleResponse(response)
    }

    /**
     * Deleting a model
     * @param key The model's key name
     */
    async modeldel(key: string): Promise<'OK'> {
        const command = this.aiCommander.modeldel(key);
        return await this.sendCommand(command);
    }

    /**
     * Running a model
     * @param key The model's key name
     * @param parameters The parameters of 'AI.MODELEXECUTE'
     */
    async modelexecute(key: string, parameters: AIModelExecute): Promise<'OK'> {
        const command = this.aiCommander.modelexecute(key, parameters);
        return await this.sendCommand(command);
    }

    /**
     * Scanning a model
     */
    async modelscan(): Promise<string[][]> {
        const command = this.aiCommander.modelscan();
        return await this.sendCommand(command);
    }

    /**
     * Setting a script
     * @param key The script's key name
     * @param parameters Additional optional parameters
     */
    async scriptset(key: string, parameters: AIScriptSetParameters): Promise<'OK'> {
        const command = this.aiCommander.scriptset(key, parameters);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving a script
     * @param key The script's key name
     * @param meta The script's device as a String
     * @param source The script's source code as a String
     */
    async scriptget(key: string, meta?: boolean, source?: boolean): Promise<AIScript | string[] | string> {
        const command = this.aiCommander.scriptget(key, meta, source);
        const response: string[] = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Deleting a script
     * @param key The script's key name
     */
    async scriptdel(key: string): Promise<'OK'> {
        const command = this.aiCommander.scriptdel(key);
        return await this.sendCommand(command);
    }

    /**
     * Running a script
     * @param key The script's key nameb
     * @param functionName The name of the function to run
     * @param parameters The parameters of the 'AI.SCRIPTEXECUTE' command
    */
    async scriptexecute(key: string, functionName: string, parameters: AIScriptExecuteParameters): Promise<'OK'> {
        const command = this.aiCommander.scriptexecute(key, functionName, parameters);
        return await this.sendCommand(command);
    }

    /**
     * Scanning a script
     */
    async scriptscan(): Promise<string[][]> {
        const command = this.aiCommander.scriptscan();
        return await this.sendCommand(command);
    }

    /**
     * Running a DAG
     * @param parameters Additional parameters required for the 'AI.DAGEXECUTE' command
     * @param commands The commands sent to the 'AI.DAGEXECUTE' command
     */
    async dagexecute(parameters: AIDagExecuteParameters, commands: string[]): Promise<string[]> {
        const command = this.aiCommander.dagexecute(parameters, commands);
        return await this.sendCommand(command)
    }

    /**
     * Running a readonly DAG
     * @param parameters Additional parameters required for the 'AI.DAGEXECUTE_RO' command
     * @param commands The commands sent to the 'AI.DAGEXECUTE_RO' command
     */
    async dagexecuteRO(parameters: AIDagExecuteParameters, commands: string[]): Promise<string[]> {
        const command = this.aiCommander.dagexecuteRO(parameters, commands);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving script/model info
     * @param key The key name of a model or script 
     * @param RESETSTAT Resets all statistics associated with the key 
     */
    async info(key: string, RESETSTAT?: boolean): Promise<AIScriptInfo | string[] | string> {
        const command = this.aiCommander.info(key, RESETSTAT);
        const response: string[] = await this.sendCommand(command);
        return this.handleResponse(response);
    }

    /**
     * Restrieving configuration
     * @param path Specifies the default base backends path to path . The backends path is used when dynamically loading a backend (default: '{module_path}/backends', where module_path is the module's path).
     * @param backend  Loads the DL/ML backend specified by the backend identifier from path . If path is relative, it is resolved by prefixing the BACKENDSPATH to it. If path is absolute then it is used as is.
     */
    async config(path: string, backend?: AIBackend): Promise<'OK'> {
        const command = this.aiCommander.config(path, backend);
        return await this.sendCommand(command);
    }
}