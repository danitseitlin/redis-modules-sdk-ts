/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FTAggregateResponse, FTAggregateResponseItem, FTSpellCheckResponse } from "./redisearch.types";

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

    /**
     * Handling the response of the aggregate function
     * @param response The raw response from the command execution
     * @returns A parsed response of the raw response
     */
    handleAggregateResponse(response) {
        return {
            numberOfItems: response[0],
            items: response.slice(1, response.length)
        };
    }
}