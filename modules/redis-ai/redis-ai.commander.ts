import { CommandData } from "../module.base";
import { AIBackend, AIDagExecuteParameters, AIDevice, AIModelExecute, AIModelSetParameters, AIScriptExecuteParameters, AIScriptSetParameters, TensorType } from "./redis-ai";

export class RedisAICommander {

    /**
     * Setting a tensor
     * @param key The tensor's key name 
     * @param type The tensor's data type can be one of: FLOAT , DOUBLE , INT8 , INT16 , INT32 , INT64 , UINT8 or UINT16 
     * @param data The tensor's data (binary/numberic)
     * @param shape One or more dimensions, or the number of elements per axis, for the tensor
     */
    tensorset(key: string, type: TensorType, shapes: number[], data?: number[] | Buffer[]): CommandData {
        const args: (number | string | Buffer)[] = [key, type];
        shapes.forEach(shape => {args.push(shape.toString())});
        if(data !== undefined) {
            args.push(data instanceof Buffer ? 'BLOB': 'VALUES');
            data.forEach((value: (number | string | Buffer)) => {args.push(value.toString())});
        }
        return {
            command: 'AI.TENSORSET',
            args: args
        }
    }

    /**
     * Retrieving a tensor
     * @param key The tensor's key name
     * @param meta Returns the tensor's metadata 
     * @param format The tensor's reply format can be one of the following (BLOB/VALUES)
     */
    tensorget(key: string, format?: 'BLOB' | 'VALUES', meta?: boolean): CommandData {
        const args = [key];
        if(meta === true){
            args.push('META');
        }
        if(format !== undefined){
            args.push(format);
        }
        return {
            command: 'AI.TENSORGET',
            args: args
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
    modelstore(key: string, backend: AIBackend, device: AIDevice, model: Buffer, options?: AIModelSetParameters): CommandData {
        let args: (string | Buffer | number)[] = [key, backend, device];
        if(options !== undefined && options.tag !== undefined){
            args = args.concat(['TAG', options.tag]);
        }
        if(options !== undefined && options.batch !== undefined) {
            args = args.concat(['BATCHSIZE', options.batch.size]);
            if(options.batch.minSize !== undefined){
                args = args.concat(['MINBATCHSIZE', options.batch.minSize]);
            }
        }
        if(options !== undefined && options.inputs !== undefined && options.inputs.length > 0){
            args = args.concat(['INPUTS', options.inputsCount].concat(options.inputs));
        }
        if(options !== undefined && options.outputs !== undefined && options.outputs.length > 0){
            args = args.concat(['OUTPUTS', options.outputsCount].concat(options.outputs));
        }
        args = args.concat(['BLOB', model]);
        return {
            command: 'AI.MODELSTORE',
            args: args
        }
    }

    /**
     * Retrieving a model
     * @param key The model's key name 
     * @param meta Will return the model's meta information on backend, device and tag
     * @param blob Will return the model's blob containing the serialized model
     */
    modelget(key: string, meta?: boolean, blob?: boolean): CommandData {
        const args = [key];
        if(meta === true){
            args.push('META');
        }
        if(blob === true){
            args.push('BLOB');
        }
        return {
            command: 'AI.MODELGET',
            args: args
        }
    }

    /**
     * Deleting a model
     * @param key The model's key name
     */
    modeldel(key: string): CommandData {
        return {
            command: 'AI.MODELDEL',
            args: [key]
        }
    }

    /**
     * Running a model
     * @param key The model's key name
     * @param parameters The parameters of 'AI.MODELEXECUTE'
     */
    modelexecute(key: string, parameters: AIModelExecute): CommandData {
        let args = [key, 'INPUTS', parameters.inputsCount];
        args = args.concat(parameters.inputs);
        args = args.concat(['OUTPUTS', parameters.outputsCount]);
        args = args.concat(parameters.outputs);
        if(parameters.timeout){
            args = args.concat(['TIMEOUT', parameters.timeout]);
        }
        return {
            command: 'AI.MODELEXECUTE',
            args: args
        }
    }

    /**
     * Scanning a model
     */
    modelscan(): CommandData {
        return {
            command: 'AI._MODELSCAN',
            args: []
        }
    }

    /**
     * Setting a script
     * @param key The script's key name
     * @param parameters Additional optional parameters
     */
    scriptset(key: string, parameters: AIScriptSetParameters): CommandData {
        let args = [key, parameters.device];
        if(parameters.tag !== undefined){
            args = args.concat(['TAG', parameters.tag]);
        }
        args = args.concat(['SOURCE', parameters.script]);
        return {
            command: 'AI.SCRIPTSET',
            args: args
        }
    }

    /**
     * Retrieving a script
     * @param key The script's key name
     * @param meta The script's device as a String
     * @param source The script's source code as a String
     */
    scriptget(key: string, meta?: boolean, source?: boolean): CommandData {
        const args = [key];
        if(meta === true){
            args.push('META');
        }
        if(source === true){
            args.push('SOURCE');
        }
        return {
            command: 'AI.SCRIPTGET',
            args: args
        }
    }

    /**
     * Deleting a script
     * @param key The script's key name
     */
    scriptdel(key: string): CommandData {
        return {
            command: 'AI.SCRIPTDEL',
            args: [key]
        }
    }

    /**
     * Running a script
     * @param key The script's key nameb
     * @param functionName The name of the function to run
     * @param parameters The parameters of the 'AI.SCRIPTEXECUTE' command
    */
    scriptexecute(key: string, functionName: string, parameters: AIScriptExecuteParameters): CommandData {
        let args = [key, functionName, 'KEYS', parameters.numberOfKeys].concat(parameters.keys)
        if(parameters.inputs && parameters.numberOfInputs && parameters.inputs.length > 0){
            args = args.concat(['INPUTS', parameters.numberOfInputs]).concat(parameters.inputs)
        }
        else if(parameters.listInputs && parameters.numberOfListInputs && parameters.listInputs.length > 0){
            args = args.concat('LIST_INPUTS', parameters.numberOfListInputs).concat(parameters.listInputs)
        }
        args = args.concat('OUTPUTS', parameters.numberOfOutputs).concat(parameters.outputs)
        if(parameters.timeout){
            args.concat('TIMEOUT', parameters.timeout)
        }
        return {
            command: 'AI.SCRIPTEXECUTE',
            args: args
        }
    }

    /**
     * Scanning a script
     */
    scriptscan(): CommandData {
        return {
            command: 'AI._SCRIPTSCAN',
            args: []
        }
    }

    /**
     * Running a DAG
     * @param parameters Additional parameters required for the 'AI.DAGEXECUTE' command
     * @param commands The commands sent to the 'AI.DAGEXECUTE' command
     */
    dagexecute(parameters: AIDagExecuteParameters, commands: string[]): CommandData {
        return {
            command: 'AI.DAGEXECUTE', 
            args: this.generateDagRunArguments(parameters, commands)
        }
    }

    /**
     * Running a readonly DAG
     * @param parameters Additional parameters required for the 'AI.DAGEXECUTE_RO' command
     * @param commands The commands sent to the 'AI.DAGEXECUTE_RO' command
     */
    dagexecuteRO(parameters: AIDagExecuteParameters, commands: string[]): CommandData {
        return {
            command: 'AI.DAGEXECUTE_RO',
            args: this.generateDagRunArguments(parameters, commands)
        }
    }

    /**
     * Generating the dagexecute CLI arguments
     * @param parameters Additional parameters required for the DAG command
     * @param commands The given commands
     */
    private generateDagRunArguments(parameters: AIDagExecuteParameters, commands: string[]): string[] {
        let args: string[] = [];
        args = args.concat([parameters.type.toUpperCase(), `${parameters.numberOfKeys}`].concat(parameters.keys));
        if(parameters.timeout) {
            args = args.concat(['TIMEOUT', `${parameters.timeout}`])
        }
        commands.forEach(command => {
            args = args.concat(['|>'].concat(command.split(' ')))
        });
        return args;
    }

    /**
     * Retrieving script/model info
     * @param key The key name of a model or script 
     * @param RESETSTAT Resets all statistics associated with the key 
     */
    info(key: string, RESETSTAT?: boolean): CommandData {
        const args = [key]
        if(RESETSTAT === true) args.push('RESETSTAT')
        return {
            command: 'AI.INFO',
            args: args
        }
    }

    /**
     * Restrieving configuration
     * @param path Specifies the default base backends path to path . The backends path is used when dynamically loading a backend (default: '{module_path}/backends', where module_path is the module's path).
     * @param backend  Loads the DL/ML backend specified by the backend identifier from path . If path is relative, it is resolved by prefixing the BACKENDSPATH to it. If path is absolute then it is used as is.
     */
    config(path: string, backend?: AIBackend): CommandData {
        let args: string[] = []
        if(backend !== undefined)
            args = args.concat(['LOADBACKEND', backend, path])
        else
            args = args.concat(['BACKENDSPATH', path])
        return {
            command: 'AI.CONFIG',
            args: args
        }
    }
}