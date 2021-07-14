/* eslint-disable @typescript-eslint/no-explicit-any */
import * as IORedis from 'ioredis';

export class Module {
    public name: string
    public redis: IORedis.Redis;
    public redisOptions: IORedis.RedisOptions
    public cluster: IORedis.Cluster;
    public clusterNodes: IORedis.ClusterNode[]
    public clusterOptions: IORedis.ClusterOptions
    public isHandleError: boolean;
    public showDebugLogs: boolean;

    /**
     * Initializing the module object
     * @param name The name of the module
     * @param clusterNodes The nodes of the cluster
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     * @param clusterOptions The options of the clusters
     */
    constructor(name: string, clusterNodes: IORedis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: IORedis.ClusterOptions, )
    /**
     * Initializing the module object
     * @param name The name of the module
     * @param redisOptions The options of the redis database
     * @param moduleOptions The additional module options
     * @param moduleOptions.isHandleError If to throw error on error
     * @param moduleOptions.showDebugLogs If to print debug logs
     */
    constructor(name: string, redisOptions: IORedis.RedisOptions, moduleOptions?: RedisModuleOptions)
    constructor(name: string, options: IORedis.RedisOptions | IORedis.ClusterNode[], moduleOptions?: RedisModuleOptions, clusterOptions?: IORedis.ClusterOptions) {
        this.name = name;
        //If it's a list of cluster nodes
        if(Array.isArray(options))
            this.clusterNodes = options as IORedis.ClusterNode[];
        else
            this.redisOptions = options as IORedis.RedisOptions;
        this.isHandleError = moduleOptions && moduleOptions.isHandleError ? moduleOptions.isHandleError: true;
        this.showDebugLogs = moduleOptions && moduleOptions.showDebugLogs ? moduleOptions.showDebugLogs: false;
        this.clusterOptions = clusterOptions ? clusterOptions: undefined;
    }

    /**
     * Connecting to the Redis database with the module
     */
    async connect(): Promise<void> {
        if(this.clusterNodes)
            this.cluster = new IORedis.Cluster(this.clusterNodes, this.clusterOptions);
        else
            this.redis = new IORedis(this.redisOptions);
    }

    /**
     * Disconnecting from the Redis database with the module
     */
    async disconnect(): Promise<void> {
        if(this.clusterNodes)
            await this.cluster.quit();
        else
            await this.redis.quit();
    }

    /**
     * Running a Redis command
     * @param command The redis command
     * @param args The args of the redis command
     */
    async sendCommand(command: string, args: IORedis.ValueType | IORedis.ValueType[] = []): Promise<any> {
        try {
            if(this.showDebugLogs)
                console.log(`${this.name}: Running command ${command} with arguments: ${args}`);
            const response = this.clusterNodes ? await this.cluster.cluster.call(command, args): await this.redis.send_command(command, args);
            if(this.showDebugLogs)
                console.log(`${this.name}: command ${command} responded with ${response}`);
            return response;
        } catch(error) {
            return this.handleError(`${this.name} class (${command.split(' ')[0]}): ${error}`)
        }
    }

    /**
     * Handling a error
     * @param module The name of the module
     * @param error The message of the error
     */
    handleError(error: string): any {
        if(this.isHandleError)
            throw new Error(error);
        return error;
    }

    /**
     * Simpilizing the response of the Module command
     * @param response The array response from the module
     */
    handleResponse(response: any): any {
        const obj = {}
        //If not an array/object
        if(
            typeof response === 'string' ||
            typeof response === 'number' ||
            (Array.isArray(response) && response.length % 2 === 1 && response.length > 1 && !this.isOnlyTwoDimensionalArray(response)) ||
            (Array.isArray(response) && response.length === 0)
        ) return response;
        else if(Array.isArray(response) && response.length === 1)
            return this.handleResponse(response[0])
        else if(Array.isArray(response)  && response.length > 1 && this.isOnlyTwoDimensionalArray(response))
            return this.handleResponse(this.reduceArrayDimension(response))
        //If is an array/obj we will build it
        for(let i = 0; i < response.length; i+=2) {
            if(response[i+1] !== '' && response[i+1] !== undefined) {
                if(Array.isArray(response[i+1]) && this.isOnlyTwoDimensionalArray(response[i+1])) {
                    obj[response[i]] = this.reduceArrayDimension(response[i+1]);
                    continue;
                }
                const value = (Array.isArray(response[i+1]) ? this.handleResponse(response[i+1]): response[i+1])
                obj[response[i]] = value;
            }
        }
        return obj
    }

    /**
     * Check if array is fully two dimensional. Only items in the array are arrays.
     * @param array The potential two dimensional array
     */
    isOnlyTwoDimensionalArray(array: any[]): boolean {
        return array.filter(item => Array.isArray(item)).length === array.length;
    }

    /**
     * Reducing an array by one level. i.e. from two dimensional to 1 dimensional.
     * @param array The potentional two dimensional array
     */
    reduceArrayDimension(array: any[][]): any[] {
        let newArray = [];
        array.forEach(singleArr => {
            newArray = newArray.concat(singleArr)
        })
        return newArray;
    }

    //private isCluster(obj): obj is IORedis.RedisOptions {
    //    return obj;
    //}
    //private isRedis() {
//
    //}
}

/**
 * The Redis module class options
 * @param isHandleError If to throw exception in case of error
 * @param showDebugLogs If to print debug logs
 */
export type RedisModuleOptions = {
    isHandleError?: boolean,
    showDebugLogs?: boolean
}