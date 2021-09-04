import { CommandData } from "./module.base";
import { RISSet } from "./ris";

export class Commander {

    /**
     * Adding an interval set 
     * @param key The name of the key
     * @param sets A list of sets to create. At least 1 set is required.
     */
    add(key: string, sets: RISSet[]): CommandData {
        let args: (number | string)[] = [key];
        for(const set of sets){
            args = args.concat([set.name, set.minimum, set.maximum])
        }
        return {
            command: 'iset.add',
            args: args
        };
    }

    /**
     * Retrieving all of key interval sets/a single set.
     * @param key The name of the key
     * @param setName Optional. The name of specific set. If not passed all interval sets under key will be retrieved. 
     */
    get(key: string, setName?: string): CommandData {
        const args = [key];
        if(setName){
            args.push(setName)
        }
        return {
            command: 'iset.get',
            args: args
        };
    }

    /**
     * Deleting a all interval sets under a key, or a single/list of specific set/s.
     * @param key The name of the key
     * @param setNames Optional. A list of set names to delete. If not passed all interval sets under key will be removed. 
     */
    del(key: string, setNames?: string[]): CommandData {
        return {
            command: 'iset.del',
            args: [key].concat(setNames)
        }
    }

    /**
     * Retrieving all sets under a key that have a specific score in their range.
     * @param key The name of the key
     * @param score The score of the set
     */
    score(key: string, score: number): CommandData {
        return {
            command: 'iset.score',
            args: [key, score]
        }
    }

    /**
     * Retrieving all sets under a key that don't have a specific score in their range.
     * @param key The name of the key
     * @param score The score of the set
     */
    notScore(key: string, score: number): CommandData {
        return {
            command: 'iset.not_score',
            args: [key, score]
        }
    }
}