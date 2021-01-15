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
     * 
     * @param array 
     */
    convertResponseToJson(response: string[], array: string[]): {[key: string]: (string | number)} {
        const obj = {}
        array.forEach(item => {
            const index = response.findIndex(outputItem => outputItem === item);
            if(index !== -1)
                obj[item] = response[index+1];
        });
        return obj
    }
}