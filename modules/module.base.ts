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
        console.log(response)
        const obj = {}
        //If not an array/object
        if(typeof response === 'string')
            return response;
        else if(Array.isArray(response))
            return this.handleResponse(response)
        //If is an array/obj we will build it
        for(let i = 0; i < response.length; i+=2) {
            if(response[i+1] !== '' && response[i+1] !== undefined) {
                const value = (Array.isArray(response[i+1]) ? this.handleResponse(response[i+1]): response[i+1])
                obj[response[i]] = value;
            }
        }
        return obj
    }

    /**
     * Converting an array to a key-value JS object based on response
     * @param response The array response from the module
     * @param keys The keys of the key-value JS object
     */
    convertArrayResponseToJson(response: string[] | string): {[key: string]: (string | number)} | string[] | string {
        const obj = {}
        if((typeof response === 'string') || (typeof response !== 'string' && response.length <= 1))
            return response;
        for(let i = 0; i < response.length; i+=2) {
            if(response[i+1] !== '' && response[i+1] !== undefined)
                obj[response[i]] = response[i+1];
        }
        return obj
    }
}