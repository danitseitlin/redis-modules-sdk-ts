import { FTSpellCheckResponse } from "./redisearch.types";

export class RedisearchHelpers {
    /**
     * Parses `spellcheck` response into a list of objects.
     * @param response The response array from the spellcheck command
     */
    handleSpellcheckResponse(response: any): FTSpellCheckResponse[] {
        const output = [];
        for(const term of response) {
            output.push({
                term: term[1],
                suggestions: (term[2] as string[]).map(
                    function (suggestionArrayElem) {
                        return {
                            score: suggestionArrayElem[0],
                            suggestion: suggestionArrayElem[1]
                        }
                    }
                )
            });
        }
        return output;
    }
}