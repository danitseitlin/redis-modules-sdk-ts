# Documentation :book:
## Links :bulb:
| Module                                                                          |                                     |                                      |                                            |
| ------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------ | ------------------------------------------ |
| [ReJSON](https://github.com/RedisJSON/RedisJSON)                                | [Section](#-rejson-module)          | [QuickStart](#quick-start-toolbox)   | [Functions](#functions-list-floppy_disk)   |
| [RedisTimeSeries](https://github.com/RedisTimeSeries/RedisTimeSeries) (RTS)     | [Section](#-redistimeseries-module) | [QuickStart](#quick-start-toolbox-1) | [Functions](#functions-list-floppy_disk-1) |
| [RediSearch](https://github.com/RediSearch/RediSearch)                          | [Section](#-redisearch-module)      | [QuickStart](#quick-start-toolbox-2) | [Functions](#functions-list-floppy_disk-2) |
| [RedisGraph](https://github.com/RedisGraph/RedisGraph)                          | [Section](#-redisgraph-module)      | [QuickStart](#quick-start-toolbox-3) | [Functions](#functions-list-floppy_disk-3) |
| [RedisGears](https://github.com/RedisGears/RedisGears)                          | [Section](#-redisgears-module)      | [QuickStart](#quick-start-toolbox-4) | [Functions](#functions-list-floppy_disk-4) |
| [RedisBloom: Bloom filter](https://github.com/RedisBloom/RedisBloom)            | [Section](#bloom-filter)            | [QuickStart](#quick-start-toolbox-5) | [Functions](#functions-list-floppy_disk-5) |
| [RedisBloom: TopK filter](https://github.com/RedisBloom/RedisBloom)             | [Section](#topk-filter)             | [QuickStart](#quick-start-toolbox-6) | [Functions](#functions-list-floppy_disk-6) |
| [RedisBloom: Cuckoo filter](https://github.com/RedisBloom/RedisBloom)           | [Section](#cuckoo-filter)           | [QuickStart](#quick-start-toolbox-7) | [Functions](#functions-list-floppy_disk-7) |
| [RedisBloom: Count Min Sketch filter](https://github.com/RedisBloom/RedisBloom) | [Section](#count-min-sketch-filter) | [QuickStart](#quick-start-toolbox-8) | [Functions](#functions-list-floppy_disk-8) |
| [RedisBloom: TDigest](https://github.com/RedisBloom/RedisBloom) | [Section](#tdigest-filter) | [QuickStart](#quick-start-toolbox-9) | [Functions](#functions-list-floppy_disk-9) |
| [RedisAI](https://github.com/RedisAI/RedisAI)                                   | [Section](#-redisai-module)         | [QuickStart](#quick-start-toolbox-10) | [Functions](#functions-list-floppy_disk-10) |
| [RedisIntervalSets](https://github.com/danitseitlin/redis-interval-sets)        | [Section](#redis-interval-sets-module)         | [QuickStart](#quick-start-toolbox-11) | [Functions](#functions-list-floppy_disk-11) |

### [Redis 'All in One' feature](#redis-all-in-one-feature)

## <img src='https://oss.redislabs.com/redisjson/images/logo.svg' style='max-width:100%;' height='30'/> ReJSON module
### Quick start :toolbox:
```
import { ReJSON } from 'redis-modules-sdk';
const client = new ReJSON({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with ReJSON module
await client.connect();

//Setting a key
const response = await client.set('key', '.', '{"x": 1, "str": "yy"}');
expect(response).to.equal('OK', 'The response of the set command');

//Disconnect from the Redis database with ReJSON module
await client.disconnect();
```
### Functions list :floppy_disk:
| Functions | Command         |
|:--------- |:--------------- |
| del       | JSON.DEL        |
| get       | JSON.GET        |
| mget      | JSON.MGET       |
| set       | JSON.SET        |
| type      | JSON.TYPE       |
| numincrby | JSON.NUMINCRBY  |
| nummultby | JSON.NUMMULTBY  |
| strappend | JSON.STRAPPEND  |
| strlen    | JSON.STRLEN     |
| arrappend | JSON.ARRAPPEND  |
| arrindex  | JSON.ARRINDEX   |
| arrinsert | JSON.ARRINSERT  |
| arrlen    | JSON.ARRLEN     |
| arrpop    | JSON.ARRPOP     |
| arrtrim   | JSON.ARRTRIM    |
| objkeys   | JSON.OBJKEYS    |
| objlen    | JSON.OBJLEN     |
| debug     | JSON.DEBUG      |
| forget    | JSON.FORGET     |
| resp      | JSON.RESP       |

## <img src='https://oss.redislabs.com/redistimeseries/images/logo.svg' style='max-width:100%;' height='30'/> RedisTimeSeries module
### Quick start :toolbox:
```
import { RedisTimeSeries } from 'redis-modules-sdk';
const client = new RedisTimeSeries({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisTimeSeries module
await client.connect();

//Deleting a key
const response = await client.del('key');
expect(response).to.equal('OK', 'The response of the del command');

//Disconnect from the Redis database with RedisTimeSeries module
await client.disconnect();
```
### Functions list :floppy_disk:
| Functions  | Command                     |
|:---------- |:--------------------------- |
| create     | TS.CREATE                   |
| alter      | TS.ALTER                    |
| add        | TS.ADD                      |
| madd       | TS.MADD                     |
| incrby     | TS.INCRBY                   |
| decrby     | TS.DECRBY                   |
| createrule | TS.CREATERULE               |
| deleterule | TS.DELETERULE               |
| range      | TS.RANGE                    |
| revrange   | TS.REVRANGE                 |
| mrange     | TS.MRANGE                   |
| mrevrange  | TS.MREVRANGE                |
| get        | TS.GET                      |
| mget       | TS.MGET                     |
| info       | TS.INFO                     |
| queryindex | TS.QUERYINDEX               |

## <img src='https://oss.redislabs.com/redisearch/img/logo.svg' style='max-width:100%;' height='30'/> Redisearch module
### Quick start :toolbox:
```
import { Redisearch } from 'redis-modules-sdk';
const client = new Redisearch({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with Redisearch module
await client.connect();

//Deleting an alias
const response = await client.aliasdel('key');
expect(response).to.equal('OK', 'The response of the aliasdel command');

//Disconnect from the Redis database with Redisearch module
await client.disconnect();
```
### Functions list :floppy_disk:
| Functions   | Command             |
|:----------- |:------------------- |
| create      | FT.CREATE           |
| search      | FT.SEARCH           |
| aggregate   | FT.AGGREGATE        |
| explain     | FT.EXPLAIN          |
| explainCLI  | FT.EXPLAINCLI       |
| alter       | FT.ALTER            |
| dropindex   | FT.DROPINDEX        |
| aliasadd    | FT.ALIASADD         |
| aliasupdate | FT.ALIASUPDATE      |
| aliasdel    | FT.ALIASDEL         |
| tagvals     | FT.TAGVALS          |
| sugadd      | FT.SUGADD           |
| sugget      | FT.SUGGET           |
| sugdel      | FT.SUGDEL           |
| suglen      | FT.SUGLEN           |
| synupdate   | FT.SYNUPDATE        |
| syndump     | FT.SYNDUMP          |
| spellcheck  | FT.SPELLCHECK       |
| dictadd     | FT.DICTADD          |
| dictdel     | FT.DICTDEL          |
| dictdump    | FT.DICTDUMP         |
| info        | FT.INFO             |
| config      | FT.CONFIG           |

## <img src='https://oss.redislabs.com/redisgraph/images/logo.svg' style='max-width:100%;' height='30'/> RedisGraph module
### Quick start :toolbox:
```
import { RedisGraph } from 'redis-modules-sdk';
const client = new RedisGraph({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisGraph module
await client.connect();

//Executing a query
const response = await client.query(graphName, 'CREATE (p:Person {name: \'Kurt\', age: 27}) RETURN p');
expect(response[2][0]).to.equal('Labels added: 1', 'The response of the GRAPH.QUERY command');

//Disconnect from the Redis database with RedisGraph module
await client.disconnect();
```
### Functions list :floppy_disk:
| Functions     | Command             |
|:------------- |:------------------- |
| query         | GRAPH.QUERY         |
| readonlyQuery | GRAPH.RO_QUERY      |
| profile       | GRAPH.PROFILE       |
| delete        | GRAPH.DELETE        |
| explain       | GRAPH.EXPLAIN       |
| slowlog       | GRAPH.SLOWLOG       |
| config        | GRAPH.CONFIG        |

## <img src='https://oss.redislabs.com/redisgears/images/RedisGears.png' style='max-width:100%;' height='30'/> RedisGears module
### Quick start :toolbox:
```
import { RedisGears } from 'redis-modules-sdk';
const client = new RedisGears({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisGears module
await client.connect();

//Executing a query
const executionId = await client.pyexecute('GB().run()', { unblocking: true })
console.log(`Execution ID: ${executionId}`)

//Disconnect from the Redis database with RedisGears module
await client.disconnect();
```
### Functions list :floppy_disk:
| Functions          | Command               |
|:------------------ |:--------------------- |
| pyexecute          | RG.PYEXECUTE          |
| abortExecution     | RG.ABORTEXECUTION     |
| configGet          | RG.RG.CONFIGGET       |
| configSet          | RG.RG.CONFIGSET       |
| dropExecution      | RG.DROPEXECUTION      |
| dumpExecutions     | RG.DUMPEXECUTIONS     |
| dumpRegistrations  | RG.DUMPREGISTRATIONS  |
| getExecution       | RG.GETEXECUTION       |
| getResults         | RG.GETRESULTS         |
| getResultsBlocking | RG.GETRESULTSBLOCKING |
| infocluster        | RG.INFOCLUSTER        |
| pystats            | RG.PYSTATS            |
| pydumpreqs         | RG.PYDUMPREQS         |
| refreshCluster     | RG.REFRESHCLUSTER     |
| trigger            | RG.TRIGGER            |
| unregister         | RG.UNREGISTER         |

## <img src='https://oss.redislabs.com/redisbloom/images/logo.svg' style='max-width:100%;' height='30'/> RedisBloom module
### Bloom filter
#### Quick start :toolbox:
```
import { RedisBloom } from 'redis-modules-sdk';
const client = new RedisBloom({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisBloom module
await client.connect();

//Adding a key
const response = await client.add('key1', 'item1')

//Disconnect from the Redis database with RedisBloom module
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions  | Command            |
|:---------- |:------------------ |
| reserve    | BF.RESERVE         |
| add        | BF.ADD             |
| madd       | BF.MADD            |
| insert     | BF.INSERT          |
| exists     | BF.EXISTS          |
| mexists    | BF.MEXISTS         |
| scandump   | BF.SCANDUMP        |
| loadchunk  | BF.LOADCHUNK       |
| info       | BF.INFO            |

### TopK filter
#### Quick start :toolbox:
```
import { RedisBloomTopK } from 'redis-modules-sdk';
const client = new RedisBloomTopK({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisBloom TopK filter
await client.connect();

//Adding a key
const response = await client.reserve(key1, 1, 2, 3, 0.1);

//Disconnect from the Redis database with RedisBloom TopK filter
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions | Command                 |
|:--------- |:----------------------- |
| reserve   | TOPK.RESERVE            |
| add       | TOPK.ADD                |
| incrby    | TOPK.INCRBY             |
| query     | TOPK.QUERY              |
| list      | TOPK.LIST               |
| info      | TOPK.INFO               |
 
### Cuckoo filter
#### Quick start :toolbox:
```
import { RedisBloomCuckoo } from 'redis-modules-sdk';
const client = new RedisBloomCuckoo({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisBloom Cuckoo filter
await client.connect();

//Adding a key
const response = await client.add('key1', 'item');

//Disconnect from the Redis database with RedisBloom Cuckoo filter
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions | Command                   |
|:--------- |:------------------------- |
| add       | CF.ADD                    |
| addnx     | CF.ADDNX                  |
| insert    | CF.INSERT                 |
| insertnx  | CF.INSERTNX               |
| exists    | CF.EXISTS                 |
| del       | CF.DEL                    |
| count     | CF.COUNT                  |
| scandump  | CF.SCANDUMP               |
| loadchunk | CF.LOADCHUNK              |
| info      | CF.INFO                   |

### Count-Min Sketch filter
#### Quick start :toolbox:
```
import { RedisBloomCMK } from 'redis-modules-sdk';
const client = new RedisBloomCMK({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisBloom Count-Min Sketch filter
await client.connect();

//Adding a key
const response = await client.initbydim('dest', 1, 2);

//Disconnect from the Redis database with RedisBloom Count-Min Sketch filter
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions  | Command                             |
|:---------- |:----------------------------------- |
| initbydim  | CMS.INITBYDIM                       |
| initbyprob | CMS.INITBYPROB                      |
| incrby     | CMS.INCRBY                          |
| query      | CMS.QUERY                           |
| merge      | CMS.MERGE                           |
| info       | CMS.INFO                            |

### TDigest filter
#### Quick start :toolbox:
```
import { RedisBloomTDigest } from 'redis-modules-sdk';
const client = new RedisBloomTDigest({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisBloom TDigest filter
await client.connect();

//Adding a key
const response = await client.create('dest', 1000);

//Disconnect from the Redis database with RedisBloom TDigest filter
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions  | Command          |
|:---------- |:---------------- |
| create     | TDIGEST.CREATE   |
| reset      | TDIGEST.RESET    |
| add        | TDIGEST.ADD      |
| merge      | TDIGEST.MERGE    |
| min        | TDIGEST.MIN      |
| max        | TDIGEST.MAX      |
| quantile   | TDIGEST.QUANTILE |
| cdf        | TDIGEST.CDF      |
| info       | TDIGEST.INFO     |

## <img src='https://oss.redislabs.com/redisai/images/logo.svg' style='max-width:100%;' height='30'/> RedisAI module
### Quick start :toolbox:
```
import { RedisAI } from 'redis-modules-sdk';
const client = new RedisAI({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RedisAI module
await client.connect();

//Setting a tensor
const response = await client.tensorset('values-key', 'FLOAT', [2, 2], [1, 2 ,3, 4])
expect(response).to.eql('OK', 'The response of tensorset')

//Disconnect from the Redis database with RedisAI module
await client.disconnect();
```
### Functions list :floppy_disk:
| Functions     | Command          |
|:------------- |:---------------- |
| tensorset     | AI.TENSORSET     |
| tensorget     | AI.TENSORGET     |
| modelstore    | AI.MODELSTORE    |
| modelget      | AI.MODELGET      |
| modeldel      | AI.MODELDEL      |
| modelexecute  | AI.MODELEXECUTE  |
| modelscan     | AI._MODELSCAN    |
| scriptset     | AI.SCRIPTSET     |
| scriptget     | AI.SCRIPTGET     |
| scriptdel     | AI.SCRIPTDEL     |
| scriptexecute | AI.SCRIPTEXECUTE |
| scriptscan    | AI._SCRIPTSCAN   |
| dagexecute    | AI.DAGEXECUTE    |
| dagexecuteRO  | AI.DAGEXECUTE_RO |
| info          | AI.INFO          |
| config        | AI.CONFIG        |

## Redis Interval Sets module
### Quick start :toolbox:
```
import { RedisIntervalSets } from 'redis-modules-sdk';
const client = new RedisIntervalSets({
    host: 'hostname',
    port: 6379
});

//Connect to the Redis database with RIS module
await client.connect();

//Retrieving a list of sets
const sets = await client.get('ages')
expect(sets.length).to.eql(2, 'The number of sets');

//Disconnect from the Redis database with RIS module
await client.disconnect();
```
### Functions list :floppy_disk:
| Functions| Command        |
|:-------- |:-------------- |
| add      | iset.add       |
| get      | iset.get       |
| del      | iset.del       |
| score    | iset.score     |
| notScore | iset.not_score |


## Redis 'All in One' feature
### Quick start :toolbox:
This feature is meant to open a connection for a database and support more than 1 module at once.
The 'Redis' class supports all existing modules in the project.

#### Module function prefixes:
| Module                               | Prefix                |
|:------------------------------------ |:--------------------- |
| ReJSON                               | rejson_module_        |
| RedisTimeSeries                      | rts_module_           |
| RediSearch                           | search_module_        |
| RedisGraph                           | graph_module_         |
| RedisGears                           | gears_module_         |
| RedisBloom (Bloom filter)            | bloom_module_         | 
| RedisBloom (TopK filer)              | bloom_topk_module_    |
| RedisBloom (Cuckoo filter)           | bloom_cuckoo_module_  |
| RedisBloom (Count Min Sketch filter) | bloom_cmk_module_     |
| RedisBloom (TDigest)                 | bloom_tdigest_module_ |
| RedisAI                              | ai_module_            |
| RedisIntervalSets                    | ris_module_           |

```
import { Redis } from 'redis-modules-sdk';
const client = new Redis({
    host: 'hostname',
    port: 43758
})

//Connect to the Redis database
await client.connect();

//For example, using Redis Interval Sets
const sets = await client.ris_module_get('ages')
expect(sets.length).to.eql(2, 'The number of sets');

//Disconnect from the Redis database
await client.disconnect();
```