import * as Redis from 'ioredis';
import { Module } from './module.base';

export class RedisGears extends Module {

    /**
     * Initializing the RedisGears object
     * @param options The options of the Redis database.
     * @param throwError If to throw an exception on error.
     */
    constructor(options: Redis.RedisOptions, throwError = true) {
        super(RedisGears.name, options, throwError)
    }

    /**
     * Aborting an existing execution
     * @param id The id of the execution
     */
    async abortExecution(id: string): Promise<'OK'> {
        try {
            return await this.redis.send_command('RG.ABORTEXECUTION', [id]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving key's configuration 
     * @param key A list of keys
     */
    async configGet(key: string[]): Promise<number> {
        try {
            return await this.redis.send_command('RG.CONFIGGET', key);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Setting key's configuration
     * @param keyvalue A key value array, i.e. [['key', 'value]]
     */
    async configSet(keyvalues: string[][]): Promise<'OK'[]> {
        try {
            const args = [];
            for(const keyvalue of keyvalues)
                args.concat(keyvalue)
            return await this.redis.send_command('RG.CONFIGSET', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Dropping an existing execution
     * @param id The id of the execution
     */
    async dropExecution(id: string): Promise<'OK'> {
        try {
            return await this.redis.send_command('RG.DROPEXECUTION', [id]);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Dumping all of the executions
     */
    async dumpExecutions(): Promise<string[][]> {
        try {
            return await this.redis.send_command('RG.DUMPEXECUTIONS');
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Dumping all of the registrations
     */
    async dumpRegistrations(): Promise<string[][]> {
        try {
            return await this.redis.send_command('RG.DUMPREGISTRATIONS');
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving an execution
     * @param id The id of the execution
     * @param options The additional optional parameters
     */
    async getExecution(id: string, options?: RGGetExecutionParameters): Promise<string[][]> {
        try {
            const args = [id.toString()];
            if(options !== undefined && options.shard === true) args.push('SHARD');
            if(options !== undefined && options.cluster === true) args.push('CLUSTER');
            return await this.redis.send_command('RG.GETEXECUTION', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving the results 
     * @param id The id of the execution
     */
    async getResults(id: string): Promise<string> {
        try {
            return await this.redis.send_command('RG.GETRESULTS', [id])
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving the results that have 'UNBLOCKING' argument (And removing it)
     * @param id The id of the execution
     */
    async getResultsBlocking(id: string): Promise<string> {
        try {
            return await this.redis.send_command('RG.GETRESULTSBLOCKING', [id])
        }
        catch(error) {
            return this.handleError(error);
        }
    }
    
    /**
     * Retrieving information about the cluster
     */
    async infocluster(): Promise<string[]> {
        try {
            return await this.redis.send_command('RG.INFOCLUSTER')
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Executing a python function
     * @param func The function
     * @param options The additional optional arguments
     */
    async pyexecute(func: string, options?: RGPyExecuteParameters): Promise<string> {
        try {
            const args = [func];
            if(options !== undefined && options.unblocking === true) args.push('UNBLOCKING');
            if(options !== undefined && options.requirements !== undefined) args.concat(['REQUIREMENTS'].concat(options.requirements));
            return await this.redis.send_command('RG.PYEXECUTE', args);
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving memory usage statistics from the 'Python interpreter'
     */
    async pystats(): Promise<string[]> {
        try {
            return await this.redis.send_command('RG.PYSTATS');
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Retrieving a list of all the python requirements available
     */
    async pydumpreqs(): Promise<string[]> {
        try {
            return await this.redis.send_command('RG.PYDUMPREQS');
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Refreshing the node's view of the cluster's topology
     */
    async refreshCluster(): Promise<'OK'> {
        try {
            return await this.redis.send_command('RG.REFRESHCLUSTER');
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Triggering the execution of a registered 'CommandReader' function
     * @param trigger The trigger's name
     * @param args The additional arguments
     */
    async trigger(trigger: string, args: string[]): Promise<string[]> {
        try {
            return await this.redis.send_command('RG.TRIGGER', [trigger].concat(args));
        }
        catch(error) {
            return this.handleError(error);
        }
    }

    /**
     * Removing the registration of a function
     * @param id The id of the execution
     */
    async unregister(id: string): Promise<'OK'> {
        try {
            return await this.redis.send_command('RG.UNREGISTER', [id]);
        }
        catch(error) {
            return this.handleError(error);
        }
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