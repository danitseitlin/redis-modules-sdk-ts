import { CommandData } from "./module.base";
import { CMKIncrbyItems } from "./redisbloom-cmk";

export class Commander {
    /**
     * Initializes a Count-Min Sketch to dimensions specified by user.
     * @param key The name of the sketch.
     * @param width The number of counter in each array. Reduces the error size.
     * @param depth The number of counter-arrays. Reduces the probability for an error of a certain size (percentage of total count).
     */
    initbydim(key: string, width: number, depth: number): CommandData {
        return {
            command: 'CMS.INITBYDIM',
            args: [key, width, depth]
        }
    }

    /**
     * Initializes a Count-Min Sketch to accommodate requested capacity.
     * @param key The name of the sketch.
     * @param errorSize Estimate size of error. The error is a percent of total counted items. This effects the width of the sketch.
     * @param probability The desired probability for inflated count.
     */
    initbyprob(key: string, errorSize: number, probability: number): CommandData {
        return {
            command: 'CMS.INITBYPROB',
            args: [key, errorSize, probability]
        }
    }

    /**
     * Increases the count of item's by increment.
     * @param key The name of the sketch.
     * @param items A list of item and increment set's
     */
    incrby(key: string, items: CMKIncrbyItems[]): CommandData {
        let args = [key];
        for(const item of items){
            args = args.concat([item.name.toString(), item.increment.toString()])
        }
        return {
            command: 'CMS.INCRBY',
            args: args
        }
    }

    /**
     * Returns count for item's.
     * @param key The name of the sketch.
     * @param items A list of items.
     */
    query(key: string, items: string[]): CommandData {
        return {
            command: 'CMS.QUERY',
            args: [key].concat(items)
        }
    }

    /**
     * Merges several sketches into one sketch.
     * @param dest The name of destination sketch.
     * @param numKeys The number of sketches to be merged.
     * @param sources The names of source sketches to be merged. 
     * @param weights A multiple of each sketch. Default =1.
     */
    merge(dest: string, numKeys: number, sources: string[], weights?: number[]): CommandData {
        let args = [dest, numKeys];
        args = args.concat(sources);
        if(weights !== undefined && weights.length > 0) {
            args.push('WEIGHTS');
            for(const weight of weights){
                args.push(`${weight}`);
            }
        }
        return {
            command: 'CMS.MERGE',
            args: args
        }
    }

    /**
     * Returning information about a key 
     * @param key The key of the 'CMS.INFO' command
     */
    info(key: string): CommandData {
        return {
            command: 'CMS.INFO',
            args: [key]
        }
        return await this.sendCommand('CMS.INFO', [key]);
    }
}