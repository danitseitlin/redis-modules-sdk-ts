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
export interface AITensor extends AIModel {
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