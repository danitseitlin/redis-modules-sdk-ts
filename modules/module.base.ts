/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Redis from 'ioredis';

export class Module {
    public redis: Redis.Redis;

    /**
     * Initializing the module object
     * @param options The options of the Redis database
     * @param throwError If to throw an exception on error.
     */
    constructor(public options: Redis.RedisOptions, public throwError: boolean) {}

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
        if(this.throwError)
            throw new Error(error);
        return error;
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