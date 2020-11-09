import * as Redis from 'ioredis';

export class RedisGears {

    public redis: Redis.Redis;

    /**
     * Initializing the RediSearch object
     * @param options The options of the Redis database.
     */
    constructor(public options: Redis.RedisOptions) {}

    /**
     * Connecting to the Redis database with ReJSON module
     */
    async connect(): Promise<void> {
        this.redis = new Redis(this.options);
    }

    /**
     * Disconnecting from the Redis database with ReJSON module
     */
    async disconnect(): Promise<void> {
        await this.redis.quit();
    }

    /**
     * Aborting an existing execution
     * @param id The id of the execution
     */
    async abortExecution(id: number): Promise<'OK'> {
        return await this.redis.send_command('RG.ABORTEXECUTION', [id]);
    }

    /**
     * Retrieving key's configuration 
     * @param key A list of keys
     */
    async configGet(key: string[]): Promise<number> {
        return await this.redis.send_command('RG.CONFIGGET', key);
    }

    /**
     * Setting key's configuration
     * @param keyvalue A key value array, i.e. [['key', 'value]]
     */
    async configSet(keyvalues: string[][]): Promise<'OK'[]> {
        const args = [];
        for(const keyvalue of keyvalues)
            args.concat(keyvalue)
        return await this.redis.send_command('RG.CONFIGSET', args);
    }

    /**
     * Dropping an existing execution
     * @param id The id of the execution
     */
    async dropExecution(id: number): Promise<'OK'> {
        return await this.redis.send_command('RG.DROPEXECUTION', [id]);
    }

    /**
     * Dumping all of the executions
     */
    async dumpExecutions(): Promise<string[][]> {
        return await this.redis.send_command('RG.DUMPEXECUTIONS');
    }

    /**
     * Dumping all of the registrations
     */
    async dumpRegistrations(): Promise<string[][]> {
        return await this.redis.send_command('RG.DUMPREGISTRATIONS');
    }

    /**
     * Retrieving an execution
     * @param id The id of the execution
     * @param options The additional optional parameters
     */
    async getExecution(id: number, options?: RGGetExecutionParameters): Promise<string[][]> {
        const args = [id.toString()];
        if(options !== undefined && options.shard !== undefined) args.push('SHARD');
        if(options !== undefined && options.cluster !== undefined) args.push('CLUSTER');
        return await this.redis.send_command('RG.GETEXECUTION', args);
    }

    /**
     * Retrieving the results 
     * @param id The id of the execution
     */
    async getResults(id: number): Promise<string> {
        return await this.redis.send_command('RG.GETRESULTS', [id])
    }

    /**
     * Retrieving the results that have 'UNBLOCKING' argument (And removing it)
     * @param id The id of the execution
     */
    async getResultsBlocking(id: number): Promise<string> {
        return await this.redis.send_command('RG.GETRESULTSBLOCKING', [id])
    }
    
    /**
     * Retrieving information about the cluster
     */
    async infocluster(): Promise<string[]> {
        return await this.redis.send_command('RG.INFOCLUSTER')
    }

    /**
     * Executing a python function
     * @param func The function
     * @param options The additional optional arguments
     */
    async pyexecute(func: string, options?: RGPyExecuteParameters): Promise<string> {
        const args = [func];
        if(options !== undefined && options.unblocking !== undefined) args.push('UNBLOCKING');
        if(options !== undefined && options.requirements !== undefined) args.concat(['REQUIREMENTS'].concat(options.requirements));
        return await this.redis.send_command('RG.PYEXECUTE', args);
    }

    /**
     * Retrieving memory usage statistics from the 'Python interpreter'
     */
    async pystats(): Promise<string[]> {
        return await this.redis.send_command('RG.PYSTATS');
    }

    /**
     * Retrieving a list of all the python requirements available
     */
    async pydumpreqs(): Promise<string[]> {
        return await this.redis.send_command('RG.PYDUMPREQS');
    }

    /**
     * Refreshing the node's view of the cluster's topology
     */
    async refreshcluster(): Promise<'OK'> {
        return await this.redis.send_command('RG.REFRESHCLUSTER');
    }

    /**
     * Triggering the execution of a registered 'CommandReader' function
     * @param trigger The trigger's name
     * @param args The additional arguments
     */
    async trigger(trigger: string, args: string[]): Promise<string[]> {
        return await this.redis.send_command('RG.TRIGGER', [trigger].concat(args));
    }

    /**
     * Removing the registration of a function
     * @param id The id of the execution
     */
    async unregister(id: number): Promise<'OK'> {
        return await this.redis.send_command('RG.UNREGISTER', [id]);
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