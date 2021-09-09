/**
 * The additional optional parameters of the 'RG.DROPEXECUTION' command
 * @param shard The 'SHARD' parameter. only gets the local execution (default in stand-alone mode) 
 * @param cluster The 'CLUSTER' parameter. collects all executions from shards (default in cluster mode) 
 */
export type RGGetExecutionParameters = {
    shard?: boolean,
    cluster?: boolean
}

/**
 * The additional optional parameters of the 'RG.PYEXECUTE' command
 * @param unblocking The 'UNBLOCKING' parameter. doesn't block the client during execution 
 * @param requirements The 'REQUIREMENTS' parameter. this argument ensures that list of dependencies it is given as an argument is installed on each shard before execution
 */
export type RGPyExecuteParameters = {
    unblocking?: boolean,
    requirements?: string[]
}