# Documentation :book:
## Links :bulb:
  1. [ReJSON](#-rejson-module)<br>
    1. [Quick start](#quick-start-toolbox)<br>
    2. [Functions](#functions-list-floppy_disk)<br>
  2. [RedisTimeSeries](#-redistimeseries-module)<br>
    1. [Quick start](#quick-start-toolbox-1)<br>
    2. [Functions](#functions-list-floppy_disk-1)<br>
  3. [RediSearch](#-redisearch-module)<br>
    1. [Quick start](#quick-start-toolbox-2)<br>
    2. [Functions](#functions-list-floppy_disk-2)<br>
  4. [RedisGraph](#-redisgraph-module)<br>
    1. [Quick start](#quick-start-toolbox-3)<br>
    2. [Functions](#functions-list-floppy_disk-3)<br>
  5. [RedisGears](#-redisgears-module)<br>
    1. [Quick start](#quick-start-toolbox-4)<br>
    2. [Functions](#functions-list-floppy_disk-4)<br>
  6. [RedisBloom Bloom filter](#bloom-filter)<br>
    1. [Quick start](#quick-start-toolbox-5)<br>
    2. [Functions](#functions-list-floppy_disk-5)<br>
  7. [RedisBloom TopK filter](#topk-filter)<br>
    1. [Quick start](#quick-start-toolbox-6)<br>
    2. [Functions](#functions-list-floppy_disk-6)<br>
  8. [RedisBloom Cuckoo filter](#cuckoo-filter)<br>
    1. [Quick start](#quick-start-toolbox-7)<br>
    2. [Functions](#functions-list-floppy_disk-7)<br>
  9. [RedisBloom Count-Min-Sketch filter](#count-min-sketch-filter)<br>
    1. [Quick start](#quick-start-toolbox-8)<br>
    2. [Functions](#functions-list-floppy_disk-8)<br>
## <img src='https://oss.redislabs.com/redisjson/images/logo.svg' style='max-width:100%;' height='30'/> ReJSON module
### Quick start :toolbox:
```
const client = new ReJSON({
    host: 'hostname',
    port: 43758,
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
| Functions | ReJSON Command  |
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
const client = new RedisTimeSeies({
    host: 'hostname',
    port: 43758,
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
| Functions  | RedisTimeSeries Command  |
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
const client = new RediSearch({
    host: 'hostname',
    port: 43758,
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
| Functions   | Redisearch Command  |
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
const client = new RedisGraph({
    host: 'hostname',
    port: 43758,
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
| Functions     | RedisGraph Command  |
|:------------- |:------------------- |
| query         | GRAPH.QUERY         |
| readonlyQuery | GRAPH.RO_QUERY      |
| profile       | GRAPH.PROFILE       |
| delete        | GRAPH.DELETE        |
| explain       | GRAPH.EXPLAIN       |
| slowlog       | GRAPH.SLOWLOG       |

## <img src='https://oss.redislabs.com/redisgears/images/RedisGears.png' style='max-width:100%;' height='30'/> RedisGears module
### Quick start :toolbox:
```
const client = new RedisGears({
    host: 'hostname',
    port: 43758,
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
| Functions          | RedisGears Command    |
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
const client = new RedisBloom({
    host: 'hostname',
    port: 43758,
});

//Connect to the Redis database with RedisBloom module
await client.connect();

//Adding a key
const response = await client.add('key1', 'item1')

//Disconnect from the Redis database with RedisBloom module
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions  | RedisBloom Command |
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
const client = new RedisBloomTopK({
    host: 'hostname',
    port: 43758,
});

//Connect to the Redis database with RedisBloom TopK filter
await client.connect();

//Adding a key
const response = await client.reserve(key1, 1, 2, 3, 0.1);

//Disconnect from the Redis database with RedisBloom TopK filter
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions | RedisBloom TopK Command |
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
const client = new RedisBloomCuckoo({
    host: 'hostname',
    port: 43758,
});

//Connect to the Redis database with RedisBloom Cuckoo filter
await client.connect();

//Adding a key
const response = await client.add('key1', 'item');

//Disconnect from the Redis database with RedisBloom Cuckoo filter
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions | RedisBloom Cuckoo Command |
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
const client = new RedisBloomCMK({
    host: 'hostname',
    port: 43758,
});

//Connect to the Redis database with RedisBloom Count-Min Sketch filter
await client.connect();

//Adding a key
const response = await client.initbydim('dest', 1, 2);

//Disconnect from the Redis database with RedisBloom Count-Min Sketch filter
await client.disconnect();
```
#### Functions list :floppy_disk:
| Functions  | RedisBloom Count-Min Sketch Command |
|:---------- |:----------------------------------- |
| initbydim  | CMS.INITBYDIM                       |
| initbyprob | CMS.INITBYPROB                      |
| incrby     | CMS.INCRBY                          |
| query      | CMS.QUERY                           |
| merge      | CMS.MERGE                           |
| info       | CMS.INFO                            |
