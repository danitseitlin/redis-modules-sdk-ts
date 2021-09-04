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
    async sendCommand(data: CommandData): Promise<any> {
        try {
            if(this.showDebugLogs)
                console.log(`${this.name}: Running command ${data.command} with arguments: ${data.args}`);
            const response = this.clusterNodes ? 
                await this.cluster.cluster.call(data.command, data.args)
                    : await this.redis.send_command(data.command, data.args);

            if(this.showDebugLogs)
                console.log(`${this.name}: command ${data.command} responded with ${response}`);
            return response;
        } catch(error) {
            return this.handleError(`${this.name} class (${data.command.split(' ')[0]}): ${error}`)
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
     * @param isSearchQuery If we should try to build search result object from result array (default: false)
     */
    handleResponse(response: any, isSearchQuery = false): any {
        //If not an array/object
        if(
            (typeof response === 'string' ||
            typeof response === 'number' ||
            (Array.isArray(response) && response.length % 2 === 1 && response.length > 1 && !this.isOnlyTwoDimensionalArray(response)) ||
            (Array.isArray(response) && response.length === 0)) &&
            !isSearchQuery
        ) {
            return response;
        }
        else if(Array.isArray(response) && response.length === 1) {
            return this.handleResponse(response[0])
        }
        else if(isSearchQuery) {
            //Search queries should be parsed into objects, if possible.
            let responseObjects = response;
            if(Array.isArray(response) && response.length % 2 === 1) {
                // Put index as 0th element
                responseObjects = [response[0]];
                // Go through returned keys (doc:1, doc:2, ...)
                for(let i = 1; i < response.length; i += 2) {
                    // propertyArray is the key-value pairs eg: ['name', 'John']
                    const propertyArray = response[i + 1];
                    responseObjects.push({
                        key: response[i] //This is the key, 'eg doc:1'
                    });
                    if(Array.isArray(propertyArray) && propertyArray.length % 2 === 0) {
                        for(let j = 0; j < propertyArray.length; j += 2) {
                            // Add keys to last responseObjects item
                            // propertyArray[j] = key name
                            // propertyArray[j+1] = value
                            responseObjects[responseObjects.length - 1][propertyArray[j]] = propertyArray[j + 1];
                        }
                    }
                }
            }
            //Check for a single dimensional array, these should only be keys, if im right
            else if(response.every(entry => !Array.isArray(entry))) {
                responseObjects = [response[0]];
                for(let i = 1; i < response.length; i++) {
                    responseObjects.push({
                        key: response[i],
                    });
                }
            }
            return responseObjects;
        }
        else if(Array.isArray(response) && response.length > 1 && this.isOnlyTwoDimensionalArray(response)) {
            return this.handleResponse(this.reduceArrayDimension(response))
        }
        const obj = {}
        //If is an array/obj we will build it
        for(let i = 0; i < response.length; i += 2) {
            if(response[i + 1] !== '' && response[i + 1] !== undefined) {
                if(Array.isArray(response[i + 1]) && this.isOnlyTwoDimensionalArray(response[i + 1])) {
                    obj[response[i]] = this.reduceArrayDimension(response[i + 1]);
                    continue;
                }
                const value = (Array.isArray(response[i + 1]) ? this.handleResponse(response[i + 1]) : response[i + 1])
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

    /**
     * Formatting given param value to string
     * @param paramValue The given param value
     * @returns A param value converted to string
     */
    paramToString(paramValue: string): string {
        if(paramValue == null) return 'null';
        const paramType = typeof paramValue;
        if(paramType == 'string') {
            let strValue = "";
            paramValue = paramValue.replace(/[\\"']/g, '\\$&');
            if(paramValue[0] != '"') strValue += "'";
            strValue += paramValue;
            if(!paramValue.endsWith('"') || paramValue.endsWith("\\\"")) strValue += "'";
            return strValue;
        }

        if(Array.isArray(paramValue)) {
            const stringsArr = new Array(paramValue.length);
            for(let i = 0; i < paramValue.length; i++) {
                stringsArr[i] = this.paramToString(paramValue[i]);
            }
            return ["[", stringsArr.join(", "), "]"].join("");
        }
        return paramValue;
    }
}

/**
 * The Redis module class options
 */
export type RedisModuleOptions = {
    /**
    * If to throw exception in case of error
    */
    isHandleError?: boolean,
    /**
    *  If to print debug logs
    */
    showDebugLogs?: boolean
}

/**
 * The command object send to the sendCommand function
 */
export type CommandData = {
    /**
     * The full Redis command
     */
    command: string,
    /**
     * The arguments passed to the command
     */
    args?: any[]
}