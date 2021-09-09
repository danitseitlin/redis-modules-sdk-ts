import { CommandData } from "../module.base";
import { RGGetExecutionParameters, RGPyExecuteParameters } from "./redisgears.types";

export class GearsCommander {
    /**
     * Aborting an existing execution
     * @param id The id of the execution
     */
    abortExecution(id: string): CommandData {
        return {
            command: 'RG.ABORTEXECUTION',
            args: [id]
        }
    }

    /**
     * Retrieving key's configuration 
     * @param key A list of keys
     */
    configGet(key: string[]): CommandData {
        return {
            command: 'RG.CONFIGGET',
            args: [key]
        }
    }

    /**
     * Setting key's configuration
     * @param keyvalue A key value array, i.e. [['key', 'value]]
     */
    configSet(keyvalues: string[][]): CommandData {
        const args = [];
        for(const keyvalue of keyvalues){
            args.concat(keyvalue)
        }
        return {
            command: 'RG.CONFIGSET',
            args: args
        }
    }

    /**
     * Dropping an existing execution
     * @param id The id of the execution
     */
    dropExecution(id: string): CommandData {
        return {
            command: 'RG.DROPEXECUTION',
            args: [id]
        }
    }

    /**
     * Dumping all of the executions
     */
    dumpExecutions(): CommandData {
        return {
            command: 'RG.DUMPEXECUTIONS'
        }
    }

    /**
     * Dumping all of the registrations
     */
    dumpRegistrations(): CommandData {
        return {
            command: 'RG.DUMPREGISTRATIONS'
        }
    }

    /**
     * Retrieving an execution
     * @param id The id of the execution
     * @param options The additional optional parameters
     */
    getExecution(id: string, options?: RGGetExecutionParameters): CommandData {
        const args = [id.toString()];
        if(options !== undefined && options.shard === true) args.push('SHARD');
        if(options !== undefined && options.cluster === true) args.push('CLUSTER');
        return {
            command: 'RG.GETEXECUTION',
            args: args
        }
    }

    /**
     * Retrieving the results 
     * @param id The id of the execution
     */
    getResults(id: string): CommandData {
        return {
            command: 'RG.GETRESULTS',
            args: [id]
        }
    }

    /**
     * Retrieving the results that have 'UNBLOCKING' argument (And removing it)
     * @param id The id of the execution
     */
    getResultsBlocking(id: string): CommandData {
        return {
            command: 'RG.GETRESULTSBLOCKING',
            args: [id]
        }
    }
    
    /**
     * Retrieving information about the cluster
     */
    infocluster(): CommandData {
        return {
            command: 'RG.INFOCLUSTER'
        }
    }

    /**
     * Executing a python function
     * @param func The function
     * @param options The additional optional arguments
     */
    pyexecute(func: string, options?: RGPyExecuteParameters): CommandData {
        const args = [func];
        if(options !== undefined && options.unblocking === true) args.push('UNBLOCKING');
        if(options !== undefined && options.requirements !== undefined) args.concat(['REQUIREMENTS'].concat(options.requirements));
        return {
            command: 'RG.PYEXECUTE',
            args: args
        }
    }

    /**
     * Retrieving memory usage statistics from the 'Python interpreter'
     */
    pystats(): CommandData {
        return {
            command: 'RG.PYSTATS'
        }
    }

    /**
     * Retrieving a list of all the python requirements available
     */
    pydumpreqs(): CommandData {
        return {
            command: 'RG.PYDUMPREQS'
        }
    }

    /**
     * Refreshing the node's view of the cluster's topology
     */
    refreshCluster(): CommandData {
        return {
            command: 'RG.REFRESHCLUSTER'
        }
    }

    /**
     * Triggering the execution of a registered 'CommandReader' function
     * @param trigger The trigger's name
     * @param args The additional arguments
     */
    trigger(trigger: string, args: string[]): CommandData {
        return {
            command: 'RG.TRIGGER',
            args: [trigger].concat(args)
        }
    }

    /**
     * Removing the registration of a function
     * @param id The id of the execution
     */
    unregister(id: string): CommandData {
        return {
            command: 'RG.UNREGISTER',
            args: [id]
        }
    }
}