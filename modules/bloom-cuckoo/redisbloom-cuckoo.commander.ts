import { CFReserveParameters, CFInsertParameters } from "./redisbloom-cuckoo";
import { CommandData } from "../module.base";

export class BloomCuckooCommander {
    
    /**
     * Creating an empty Bloom Cuckoo filter with a given initial capacity.
     * @param key The key under which the filter is to be found
     * @param capacity The number of entries you intend to add to the filter. Performance will begin to degrade after adding more items than this number. The actual degradation will depend on how far the limit has been exceeded. Performance will degrade linearly as the number of entries grow exponentially. 
     * @param options The additional optional parameters
     */
     reserve(key: string, capacity: number, options?: CFReserveParameters): CommandData {
        let args = [key, capacity];
        if(options && options.bucketSize)
            args = args.concat(['BUCKETSIZE', options.bucketSize])
        if(options && options.maxIteractions)
            args = args.concat(['MAXITERATIONS', options.maxIteractions])
        if(options && options.expansion)
            args = args.concat(['EXPANSION', options.expansion])
        return {
            command: 'CF.RESERVE',
            args: args
        }
    }

    /**
     * Adding an item to the cuckoo filter, creating the filter if it does not exist.
     * @param key The name of the filter
     * @param item The item to add
     */
    add(key: string, item: string): CommandData {
        return {
            command: 'CF.ADD',
            args: [key, item]
        }
    }

    /**
     * Adding an item to a cuckoo filter if the item did not exist previously.
     * @param key The name of the filter
     * @param item The item to add
     */
    addnx(key: string, item: string): CommandData {
        return {
            command: 'CF.ADDNX',
            args: [key, item]
        }
    }

    /**
     * Adding one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.
     * @param key The name of the filter
     * @param items Begin the list of items to add
     * @param options The additional optional parameters of the 'CF.INSERT' command
     */
    insert(key: string, items: string[], options?: CFInsertParameters): CommandData {
        let args = [key];
        if(options !== undefined && options.capacity !== undefined)
            args = args.concat(['CAPACITY', options.capacity.toString()]);
        if(options !== undefined && options.nocreate !== undefined)
            args.push('NOCREATE');
        args = args.concat(['ITEMS']).concat(items)
        return {
            command: 'CF.INSERT',
            args: args
        }
    }

    /**
     * Adding one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.
     * @param key The name of the filter
     * @param items The items of the 'CF.INSERT' command
     * @param options The additional optional parameters of the 'CF.INSERTNX' command
     */
    insertnx(key: string, items: string[], options?: CFInsertParameters): CommandData {
        let args = [key];
        if(options !== undefined && options.capacity !== undefined)
            args = args.concat(['CAPACITY', options.capacity.toString()]);
        if(options !== undefined && options.nocreate !== undefined)
            args.push('NOCREATE');
        args =  args.concat(['ITEMS']).concat(items);
        return {
            command: 'CF.INSERTNX',
            args: args
        }
    }

    /**
     * Determining whether an item may exist in the Cuckoo Filter or not.
     * @param key The name of the filter
     * @param item The item to check for
     */
    exists(key: string, item: string): CommandData {
        return {
            command: 'CF.EXISTS',
            args: [key, item]
        }
    }

    /**
     * Deleting an item once from the filter. If the item exists only once, it will be removed from the filter.
     * @param key The name of the filter
     * @param item The item to delete from the filter
     */
    del(key: string, item: string): CommandData {
        return {
            command: 'CF.DEL',
            args: [key, item]
        }
    }

    /**
     * Returning the number of times an item may be in the filter.
     * @param key The name of the filter
     * @param item The item to count
     */
    count(key: string, item: string): CommandData {
        return {
            command: 'CF.COUNT',
            args: [key, item]
        }
    }

    /**
     * Begining an incremental save of the Cuckoo filter
     * @param key The name of the filter
     * @param iterator Iterator value. This is either 0, or the iterator from a previous invocation of this command
     */
    scandump(key: string, iterator: number): CommandData {
        return {
            command: 'CF.SCANDUMP',
            args: [key, iterator]
        }
    }

    /**
     * Restoring a filter previously saved using SCANDUMP.
     * @param key The name of the key to restore
     * @param iterator The iterator value associated with data (returned by SCANDUMP )
     * @param data The current data chunk (returned by SCANDUMP ) 
     */
    loadchunk(key: string, iterator: number, data: string): CommandData {
        return {
            command: 'CF.LOADCHUNK',
            args: [key, iterator, data]
        }
    }
    
    /**
     * Returning information about a key 
     * @param key The name of the filter
     */
    info(key: string): CommandData {
        return {
            command: 'CF.INFO', 
            args: [key]
        }
    }
}