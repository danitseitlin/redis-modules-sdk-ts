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
     * 
     * @param response 
     */
    handleAggregateResponse(response: any): FTAggregateResponse {
        const numberOfItems = response[0];
        const items: FTAggregateResponseItem[] = [];
        for(let i = 1; i < response.length; i++) {
            items.push({
                name: response[i][0],
                value: response[i][1]
            })
        }
        return {
            numberOfItems: numberOfItems,
            items: items
        };
    }
}