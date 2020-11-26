<p align='center'>
  <a href='https://www.npmjs.com/package/redis-modules-sdk'>
    <img src='https://img.shields.io/npm/v/redis-modules-sdk/latest?style=plastic' target='_blank' />
  </a>
  <a href='https://npmjs.org/package/redis-modules-sdk' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/npm/dm/redis-modules-sdk.svg?color=blue&style=plastic' target='_blank' />
  </a>
  <a href='https://github.com/danitseitlin/redis-modules-sdk/issues' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/github/issues/danitseitlin/redis-modules-sdk?style=plastic' target='_blank' />
  </a>
  <a href='https://npmjs.org/package/redis-modules-sdk' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/bundlephobia/min/redis-modules-sdk/latest?style=plastic' target='_blank' />
  </a>
  <a href='https://github.com/danitseitlin/redis-modules-sdk/commits/master'>
    <img src='https://img.shields.io/github/last-commit/danitseitlin/redis-modules-sdk?style=plastic' />
  </a>
  <a href='https://github.com/danitseitlin/redis-modules-sdk/blob/master/LICENSE'>
    <img src='https://img.shields.io/badge/license-BSD%203%20Clause-blue.svg?style=plastic' target='_blank' />
  </a>
</p></p>

#### A Software development kit for easier connection and execution of Redis Modules commands

<p align='center'>
  <img src='https://github.com/danitseitlin/redis-modules-sdk/blob/master/.github/workflows/images/logo.png' />
</p>

# A few words :speech_balloon:
An open source SDK of all the available Redis modules, built with TypeScript for better typing experiences and better usages.
## Benefits :zap: :speak_no_evil:
1. All in 1, all Redis modules are covered in 1 project
2. Amazing :fire: typing experiences, all types are well documented and easy to use!
3. Easy to find your Redis command, each Redis module command has a referenced function in it's class!

# Let's get started :memo:
### Installing latest version:<br>
```
npm install redis-modules-sdk@latest
```
### Versions & Releases
* A list of existing versions can be found [here](https://www.npmjs.com/package/redis-modules-sdk?activeTab=versions)
* A list of releases will be found [here](https://github.com/danitseitlin/redis-modules-sdk/releases)

# Documentation :book:
## Links :bulb:
  1. [ReJSON](#-rejson-module)<br>
    1. [Quick start](#quick-start-toolbox)<br>
    2. [Functions](#functions-list)<br>
  2. [RedisTimeSeries](#-redistimeseries-module)<br>
    1. [Quick start](#quick-start-1-toolbox)<br>
    2. [Functions](#functions-list-1-floppy_disk)<br>
  3. [RediSearch](#-redisearch-module)<br>
    1. [Quick start](#quick-start-2-toolbox)<br>
    2. [Functions](#functions-list-2-floppy_disk)<br>
  4. [RedisGraph](#-redisgraph-module)<br>
    1. [Quick start](#quick-start-3-toolbox)<br>
    2. [Functions](#functions-list-3-floppy_disk)<br>
  5. [RedisGears](#-redisgears-module)<br>
    1. [Quick start](#quick-start-4-toolbox)<br>
    2. [Functions](#functions-list-4-floppy_disk)<br>
  6. [RedisBloom Bloom filter](#bloom-filter)<br>
    1. [Quick start](#quick-start-5-toolbox)<br>
    2. [Functions](#functions-list-5-floppy_disk)<br>
  7. [RedisBloom TopK filter](#topk-filter)<br>
    1. [Quick start](#quick-start-6-toolbox)<br>
    2. [Functions](#functions-list-6-floppy_disk)<br>
  8. [RedisBloom Cuckoo filter](#cuckoo-filter)<br>
    1. [Quick start](#quick-start-7-toolbox)<br>
    2. [Functions](#functions-list-7-floppy_disk)<br>
  9. [RedisBloom Count-Min-Sketch filter](#count-min-sketch-filter)<br>
    1. [Quick start](#quick-start-8-toolbox)<br>
    2. [Functions](#functions-list-8-floppy_disk)<br>
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
