import { CommandData } from "../module.base";
import { TOPKIncrbyItems } from "./redisbloom-topk";

export class BloomTopkCommander {
    
    /**
     * Initializing a TopK with specified parameters
     * @param key The key under which the sketch is to be found. 
     * @param topk The number of top occurring items to keep. 
     * @param width The number of counters kept in each array. 
     * @param depth The number of arrays. 
     * @param decay The probability of reducing a counter in an occupied bucket. It is raised to power of it's counter (decay ^ bucket[i].counter). Therefore, as the counter gets higher, the chance of a reduction is being reduced. 
     */
    reserve(key: string, topk: number, width: number, depth: number, decay: number): CommandData {
        return {
            command: 'TOPK.RESERVE',
            args: [key, topk, width, depth, decay]
        }
    }

    /**
     * Adding an item to the data structure. 
     * @param key Name of sketch where item is added.
     * @param items Item/s to be added.
     */
    add(key: string, items: (number | string)[]): CommandData {
        const args = [key].concat(items as string[]);
        return {
            command: 'TOPK.ADD',
            args
        }
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    incrby(key: string, items: TOPKIncrbyItems[]): CommandData {
        let args = [key];
        for(const item of items) {
            args = args.concat([item.name.toString(), item.increment.toString()])
        }
        return {
            command: 'TOPK.INCRBY',
            args: args
        }
    }
    
    /**
     * Checking whether an item is one of Top-K items.
     * @param key Name of sketch where item is queried.
     * @param items Item/s to be queried.
     */
    query(key: string, items: (string | number)[]): CommandData {
        const args = [key].concat(items as string[]);
        return {
            command: 'TOPK.QUERY',
            args: args
        }
    }

    /**
     * Returning count for an item.
     * @param key Name of sketch where item is counted.
     * @param items Item/s to be counted.
     */
    count(key: string, items: (string | number)[]): CommandData {
        const args = [key].concat(items as string[]);
        return {
            command: 'TOPK.COUNT',
            args: args
        }
    }

    /**
     * Returning full list of items in Top K list.
     * @param key Name of sketch where item is counted. 
     */
    list(key: string): CommandData {
        return {
            command: 'TOPK.LIST',
            args: [key]
        }
    }
    
    /**
     * Returning information about a key 
     * @param key Name of sketch.
     */
    info(key: string): CommandData {
        return {
            command: 'TOPK.INFO',
            args: [key]
        }
    }
}