import * as Redis from 'ioredis';
import { Module, RedisModuleOptions } from './module.base';
import { Commander } from './redisgears.commander';

export class RedisGears extends Module {

    private commander: Commander
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
        super(RedisGears.name, options, moduleOptions, clusterOptions)
        this.commander = new Commander()
    }

    /**
     * Aborting an existing execution
     * @param id The id of the execution
     */
    async abortExecution(id: string): Promise<'OK'> {
        const commander = this.commander.abortExecution(id);
        return await this.sendCommand(commander);
    }

    /**
     * Retrieving key's configuration 
     * @param key A list of keys
     */
    async configGet(key: string[]): Promise<number> {
        const command = this.commander.configGet(key);
        return await this.sendCommand(command);
    }

    /**
     * Setting key's configuration
     * @param keyvalue A key value array, i.e. [['key', 'value]]
     */
    async configSet(keyvalues: string[][]): Promise<'OK'[]> {
        const command = this.commander.configSet(keyvalues);
        return await this.sendCommand(command);
    }

    /**
     * Dropping an existing execution
     * @param id The id of the execution
     */
    async dropExecution(id: string): Promise<'OK'> {
        const command = this.commander.dropExecution(id);
        return await this.sendCommand(command);
    }

    /**
     * Dumping all of the executions
     */
    async dumpExecutions(): Promise<string[][]> {
        const command = this.commander.dumpExecutions();
        return await this.sendCommand(command);
    }

    /**
     * Dumping all of the registrations
     */
    async dumpRegistrations(): Promise<string[][]> {
        const command = this.commander.dumpRegistrations();
        return await this.sendCommand(command);
    }

    /**
     * Retrieving an execution
     * @param id The id of the execution
     * @param options The additional optional parameters
     */
    async getExecution(id: string, options?: RGGetExecutionParameters): Promise<string[][]> {
        const command = this.commander.getExecution(id, options);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving the results 
     * @param id The id of the execution
     */
    async getResults(id: string): Promise<string> {
        const command = this.commander.getResults(id);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving the results that have 'UNBLOCKING' argument (And removing it)
     * @param id The id of the execution
     */
    async getResultsBlocking(id: string): Promise<string> {
        const command = this.commander.getResultsBlocking(id);
        return await this.sendCommand(command);
    }
    
    /**
     * Retrieving information about the cluster
     */
    async infocluster(): Promise<string[]> {
        const command = this.commander.infocluster();
        return await this.sendCommand(command);
    }

    /**
     * Executing a python function
     * @param func The function
     * @param options The additional optional arguments
     */
    async pyexecute(func: string, options?: RGPyExecuteParameters): Promise<string> {
        const command = this.commander.pyexecute(func, options);
        return await this.sendCommand(command);
    }

    /**
     * Retrieving memory usage statistics from the 'Python interpreter'
     */
    async pystats(): Promise<string[]> {
        const command = this.commander.pystats();
        return await this.sendCommand(command);
    }

    /**
     * Retrieving a list of all the python requirements available
     */
    async pydumpreqs(): Promise<string[]> {
        const command = this.commander.pydumpreqs();
        return await this.sendCommand(command);
    }

    /**
     * Refreshing the node's view of the cluster's topology
     */
    async refreshCluster(): Promise<'OK'> {
        const command = this.commander.refreshCluster();
        return await this.sendCommand(command);
    }

    /**
     * Triggering the execution of a registered 'CommandReader' function
     * @param trigger The trigger's name
     * @param args The additional arguments
     */
    async trigger(trigger: string, args: string[]): Promise<string[]> {
        const command = this.commander.trigger(trigger, args);
        return await this.sendCommand(command);
    }

    /**
     * Removing the registration of a function
     * @param id The id of the execution
     */
    async unregister(id: string): Promise<'OK'> {
        const command = this.commander.unregister(id);
        return await this.sendCommand(command);
    }
}

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