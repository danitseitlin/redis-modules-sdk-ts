/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { log, LogLevel } from "../module.base";
import { FTAggregateResponse, FTAggregateResponseItem, FTParsedSearchResponse, FTSpellCheckResponse } from "./redisearch.types";

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

    /**
     * 
     * @param response 
     * @returns 
     */
    handleQueryResponse(response: any) {
        log(LogLevel.DEBUG, `****** Function handleQueryResponse ******`);
        //Search queries should be parsed into objects, if possible.
        let responseObjects = response;
        //If the response is an array with 1 item, we will return it as the value.
        if(Array.isArray(response) && response.length === 1 && !Array.isArray(response[0])) {
            log(LogLevel.DEBUG, `The response is ${response[0]}`);
            return response[0];
        }
        //In case we have an array with a odd number of items, we will parse it as required. 
        else if(Array.isArray(response) && response.length % 2 === 1) {
            // Put index as 0th element
            responseObjects = [response[0]];
            // Go through returned keys (doc:1, doc:2, ...)
            for(let i = 1; i < response.length; i += 2) {
                // propertyArray is the key-value pairs eg: ['name', 'John']
                const propertyArray = response[i + 1];
                responseObjects.push({
                    key: response[i] //This is the key, 'eg doc:1'
                });
                if(Array.isArray(propertyArray) && propertyArray.length % 2 === 0) {
                    for(let j = 0; j < propertyArray.length; j += 2) {
                        // Add keys to last responseObjects item
                        // propertyArray[j] = key name
                        // propertyArray[j+1] = value
                        responseObjects[responseObjects.length - 1][propertyArray[j]] = propertyArray[j + 1];
                    }
                }
            }
        }
        //Check for a single dimensional array, these should only be keys, if im right
        else if(response.every((entry: any) => !Array.isArray(entry))) {
            responseObjects = [response[0]];
            for(let i = 1; i < response.length; i++) {
                responseObjects.push({
                    key: response[i],
                });
            }
        }
        else {
            log(LogLevel.DEBUG, 'Parsing response to JSON:')
            const responses = response
            const resultCounts = responses[0];
            responseObjects = {}
            responseObjects.resultsCount = resultCounts;
            responseObjects.documentIds = []
            responseObjects.data = []
            for(let i = 1; i < responses.length; i ++) {
                if(Array.isArray(responses[i])) {
                    responseObjects.data = responseObjects.data.concat(responses[i])
                }
                else {
                    responseObjects.documentIds.push(responses[i])
                }
            }
        }
        return responseObjects as FTParsedSearchResponse;
    }
}