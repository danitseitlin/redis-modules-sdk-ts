/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Redis from 'ioredis';

export class Module {
    public redis: Redis.Redis;

    /**
     * Initializing the module object
     * @param options The options of the Redis database
     * @param throwError If to throw an exception on error.
     */
    constructor(public name: string, public options: Redis.RedisOptions, public throwError: boolean) {}

    /**
     * Connecting to the Redis database with the module
     */
    async connect(): Promise<void> {
        this.redis = new Redis(this.options);
    }

    /**
     * Disconnecting from the Redis database with the module
     */
    async disconnect(): Promise<void> {
        await this.redis.quit();
    }

    /**
     * Handling a error
     * @param module The name of the module
     * @param error The message of the error
     */
    handleError(error: string): any {
        const err = `${this.name}: ${error}`
        if(this.throwError)
            throw new Error(err);
        return err;
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
}