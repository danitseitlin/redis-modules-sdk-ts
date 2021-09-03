import { BFReserveParameter, BFInsertParameters } from "..";
import { CommandData } from "./module.base";

export class Commander {
    /**
     * Creating an empty Bloom filter with a given desired error ratio and initial capacity.
     * @param key The key under which the filter is to be found
     * @param errorRate The desired probability for false positives. This should be a decimal value between 0 and 1. For example, for a desired false positive rate of 0.1% (1 in 1000), error_rate should be set to 0.001. The closer this number is to zero, the greater the memory consumption per item and the more CPU usage per operation.
     * @param capacity The number of entries you intend to add to the filter. Performance will begin to degrade after adding more items than this number. The actual degradation will depend on how far the limit has been exceeded. Performance will degrade linearly as the number of entries grow exponentially. 
     * @param options The additional optional parameters
     */
    reserve(key: string, errorRate: number, capacity: number, options?: BFReserveParameter): CommandData {
        const args = [key, errorRate, capacity];
        if(options !== undefined && options.expansion !== undefined)
            args.push(options.expansion);
        if(options !== undefined && options.nonscaling === true)
            args.push('NONSCALING');
        return {
            command: 'BF.RESERVE',
            args: args
        }
    }

    /**
     * Adding an item to the Bloom Filter, creating the filter if it does not yet exist.
     * @param key The key of the 'BF.ADD' command
     * @param item The item of the 'BF.ADD' command
     */
    add(key: string, item: string): CommandData {
        return {
            command: 'BF.ADD',
            args: [key, item]
        }
    }

    /**
     * Adding one or more items to the Bloom Filter, creating the filter if it does not yet exist. This command operates identically to BF.ADD except it allows multiple inputs and returns multiple values     * @param key 
     * @param items The items of the 'BF.MADD' command
     */
    madd(key: string, items: string[]): CommandData {
        return {
            command: 'BF.MADD',
            args: [key].concat(items)
        }
    }

    /**
     * Adding one or more items to the bloom filter, by default creating it if it does not yet exist. There are several arguments which may be used to modify this behavior.
     * @param key The key of the 'BF.INSERT' command
     * @param items The items of the 'BF.INSERT' command
     * @param options The additional optional parameters of the 'BF.INSERT' command
     */
    insert(key: string, items: string[], options?: BFInsertParameters): CommandData {
        let args = [key];
        if(options !== undefined && options.capacity !== undefined)
            args = args.concat(['CAPACITY', options.capacity.toString()]);
        if(options !== undefined && options.error !== undefined)
            args = args.concat(['ERROR', options.error]);
        if(options !== undefined && options.expansion !== undefined)
            args = args.concat(['EXPANSION', options.expansion]);
        if(options !== undefined && options.nocreate !== undefined)
            args.push('NOCREATE');
        if(options !== undefined && options.noscaling !== undefined)
            args.push('NOSCALING');
        args.push('ITEMS')
        args = args.concat(items)
        return {
            command: 'BF.INSERT',
            args: args
        }
    }

    /**
     * Determining whether an item may exist in the Bloom Filter or not.
     * @param key The key of the 'BF.EXISTS' command
     * @param item The key of the 'BF.EXISTS' command
     */
    exists(key: string, item: string): CommandData {
        return {
            command: 'BF.EXISTS',
            args: [key, item]
        }
    }

    /**
     * Determining if one or more items may exist in the filter or not.
     * @param key The key of the 'BF.MEXISTS' command
     * @param items The items of the 'BF.MEXISTS' command
     */
    mexists(key: string, items: string[]): CommandData {
        return {
            command: 'BF.MEXISTS',
            args: [key].concat(items)
        }
    }

    /**
     * Begining an incremental save of the bloom filter
     * @param key The key of the 'BF.SCANDUMP' command
     * @param iterator The iterator of the 'BF.SCANDUMP' command
     */
    scandump(key: string, iterator: number): CommandData {
        return {
            command: 'BF.SCANDUMP',
            args: [key, iterator]
        }
    }

    /**
     * Restoring a filter previously saved using SCANDUMP.
     * @param key The key of the 'BF.LOADCHUNK' command
     * @param iterator The iterator of the 'BF.LOADCHUNK' command
     * @param data The data of the 'BF.LOADCHUNK' command
     */
    loadchunk(key: string, iterator: number, data: string): CommandData {
        return {
            command: 'BF.LOADCHUNK',
            args: [key, iterator, data]
        }
    }

    /**
     * Returning information about a key 
     * @param key The key of the 'BF.INFO' command
     */
    info(key: string): CommandData {
        return {
            command: 'BF.INFO',
            args: [key]
        }
    }
}