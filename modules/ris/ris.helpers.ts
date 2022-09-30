import { RedisIntervalSet } from "./ris.types";

export class RedisIntervalSetsHelpers {
    /**
     * Parsing the iset.get command response
     * @param sets The list of sets
     */
    parseGet(sets: string[][]): RedisIntervalSet[] {
        const parsedSets: RedisIntervalSet[] = [];
        for(const set of sets) {
            if(set.length > 2){
                parsedSets.push({name: set[0], minimum: parseInt(set[1]), maximum: parseInt(set[2])})
            }
            else {
                return [{minimum: parseInt(set[0]), maximum: parseInt(set[1])}]
            }
        }
        return parsedSets;
    }
}