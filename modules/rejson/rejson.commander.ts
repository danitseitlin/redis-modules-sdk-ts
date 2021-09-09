import { CommandData } from "../module.base";
import { ReJSONGetParameters } from "./rejson.types";

export class RejsonCommander {
    /**
     * Deleting a JSON key
     * @param key The name of the key
     * @param path The path of the key defaults to root if not provided. Non-existing keys and paths are ignored. Deleting an object's root is equivalent to deleting the key from Redis.
     * @returns The number of paths deleted (0 or 1).
     */
    del(key: string, path?: string): CommandData {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return {
            command: 'JSON.DEL',
            args: parameters
        }
    }

    /**
     * Clearing a JSON key
     * @param key The name of the key
     * @param path The path of the key defaults to root if not provided. Non-existing keys and paths are ignored. Deleting an object's root is equivalent to deleting the key from Redis.
     * @returns The number of paths deleted (0 or 1).
     */
    clear(key: string, path?: string): CommandData {
        const parameters = [key];
        if(path !== undefined) parameters.push(path);
        return {
            command: 'JSON.CLEAR',
            args: parameters
        }
    }

    /**
     * Toggling a JSON key
     * @param key The name of the key
     * @param path The path of the key defaults to root if not provided. Non-existing keys and paths are ignored. Deleting an object's root is equivalent to deleting the key from Redis.
     * @returns The value of the path after the toggle.
     */
    toggle(key: string, path?: string): CommandData {
        const parameters = [key];
        if(path !== undefined) parameters.push(path);
        return {
            command: 'JSON.TOGGLE',
            args: parameters
        }
    }

    /**
     * Setting a new JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @param json The JSON string of the key i.e. '{"x": 4}'
     * @param condition Optional. The condition to set the JSON in.
     * @returns Simple String OK if executed correctly, or Null Bulk if the specified NX or XX conditions were not met. 
     */
    set(key: string, path: string, json: string, condition?: 'NX' | 'XX'): CommandData {
        const args = [key, path, json]
        if(condition){
            args.push(condition)
        }
        return {
            command: 'JSON.SET',
            args: args
        }
    }

    /**
     * Retrieving a JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @param parameters Additional parameters to arrange the returned values
     * @returns The value at path in JSON serialized form.
     */
    get(key: string, path?: string, parameters?: ReJSONGetParameters): CommandData{
        const args = [key];
        for(const parameter in parameters) {
            const name = parameter.toUpperCase();
            const value = parameters[parameter];
            args.push(name);
            if(typeof value !== 'boolean')
                args.push(value);
        }
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.GET',
            args: args
        }
    }

    /**
     * Retrieving values from multiple keys
     * @param keys A list of keys
     * @param path The path of the keys
     * @returns The values at path from multiple key's. Non-existing keys and non-existing paths are reported as null.
     */
    mget(keys: string[], path?: string): CommandData {
        const args = keys;
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.MGET',
            args: args
        }
    }

    /**
     * Retrieving the type of a JSON key
     * @param key The name of the key
     * @param path The path of the key
     * @returns Simple String, specifically the type of value. 
     */
    type(key: string, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.TYPE',
            args: args
        }
    }

    /**
     * Increasing JSON key value by number
     * @param key The name of the key
     * @param number The number to increase by
     * @param path The path of the key
     * @returns Bulk String, specifically the stringified new value.
     */
    numincrby(key: string, number: number, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(`${number}`);
        return {
            command: 'JSON.NUMINCRBY',
            args: args
        }
    }

    /**
     * Multiplying JSON key value by number
     * @param key The name of the key
     * @param number The number to multiply by
     * @param path The path of the key
     * @returns Bulk String, specifically the stringified new value. 
     */
    nummultby(key: string, number: number, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(`${number}`);
        return {
            command: 'JSON.NUMMULTBY',
            args: args
        }
    }

    /**
     * Appending string to JSON key string value
     * @param key The name of the key
     * @param string The string to append to key value 
     * @param path The path of the key
     * @returns Integer, specifically the string's new length.
     */
    strappend(key: string, string: string, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.STRAPPEND',
            args: args.concat(string)
        };
    }

    /**
     * Retrieving the length of a JSON key value
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the string's length. 
     */
    strlen(key: string, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.STRLEN',
            args: args
        }
    }

    /**
     * Appending string to JSON key array value
     * @param key The name of the key
     * @param items The items to append to an existing JSON array
     * @param path The path of the key
     * @returns Integer, specifically the array's new size.
     */
    arrappend(key: string, items: string[], path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.ARRAPPEND',
            args: args.concat(items)
        }
    }

    /**
     * Retrieving JSON key array item by index
     * @param key The name of the key
     * @param scalar The scalar to filter out a JSON key
     * @param path The path of the key
     * @returns Integer, specifically the position of the scalar value in the array, or -1 if unfound. 
     */
    arrindex(key: string, scalar: string, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(scalar);
        return {
            command: 'JSON.ARRINDEX',
            args: args
        }
    }
    
    /**
     * Inserting item into JSON key array
     * @param key The name of the key
     * @param index The index to insert the JSON into the array
     * @param json The JSON string to insert into the array
     * @param path The path of the key
     * @returns Integer, specifically the array's new size.
     */
    arrinsert(key: string, index: number, json: string, path?: string): CommandData {
        let args = [key];
        if(path !== undefined) args.push(path);
        args = args.concat([`${index}`, `${json}`])
        return {
            command: 'JSON.ARRINSERT',
            args: args
        }
    }

    /**
     * Retrieving the length of a JSON key array
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the array's length. 
     */
    arrlen(key: string, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.ARRLEN',
            args: args
        }
    }

    /**
     * Poping an array item by index
     * @param key The name of the key
     * @param index The index of the array item to pop
     * @param path The path of the key
     * @returns Bulk String, specifically the popped JSON value.
     */
    arrpop(key: string, index: number, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        args.push(`${index}`);
        return {
            command: 'JSON.ARRPOP',
            args: args
        }
    }

    /**
     * Triming an array by index range
     * @param key The name of the key
     * @param start The starting index of the trim
     * @param end The ending index of the trim
     * @param path The path of the key
     * @returns Integer, specifically the array's new size. 
     */
    arrtrim(key: string, start: number, end: number, path?: string): CommandData {
        let args = [key];
        if(path !== undefined) args.push(path);
        args = args.concat([`${start}`, `${end}`]);
        return {
            command: 'JSON.ARRTRIM',
            args: args
        }
    }

    /**
     * Retrieving an array of JSON keys
     * @param key The name of the key
     * @param path The path of the key
     * @returns Array, specifically the key names in the object as Bulk Strings. 
     */
    objkeys(key: string, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.OBJKEYS',
            args: args
        }
    }

    /**
     * Retrieving the length of a JSON
     * @param key The name of the key
     * @param path The path of the key
     * @returns Integer, specifically the number of keys in the object.
     */
    objlen(key: string, path?: string): CommandData {
        const args = [key];
        if(path !== undefined) args.push(path);
        return {
            command: 'JSON.OBJLEN',
            args: args
        }
    }

    /**
     * Executing debug command
     * @param subcommand The subcommand of the debug command
     * @param key The name of the key
     * @param path The path of the key
     * @returns 
        MEMORY returns an integer, specifically the size in bytes of the value
        HELP returns an array, specifically with the help message
     */
    debug(subcommand: 'MEMORY' | 'HELP', key?: string, path?: string): CommandData {
        const args: string[] = [subcommand];
        if(subcommand === 'MEMORY') {
            if(key !== undefined) args.push(key);
            if(path !== undefined) args.push(path);
        }
        return {
            command: 'JSON.DEBUG',
            args: args
        }
    }

    /**
     * An alias of delCommand
     * @param key The name of the key
     * @param path The path of the key
     * @returns The number of paths deleted (0 or 1).
     */
    forget(key: string, path?: string): CommandData {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return {
            command: 'JSON.FORGET',
            args: parameters
        }
    }

    /**
     * Retrieving a JSON key value in RESP protocol
     * @param key The name of the key
     * @param path The path of the key
     * @returns Array, specifically the JSON's RESP form as detailed. 
     */
    resp(key: string, path?: string): CommandData {
        const parameters = [key];
        if(path !== undefined) parameters.push(path)
        return {
            command: 'JSON.RESP',
            args: parameters
        }
    }
}