# Redis modules project
A project meant for connecting to Redis databases with modules easily, built with Typescript.

## <img src='https://oss.redislabs.com/redisjson/images/logo.svg' style='max-width:100%;' height='30'/> ReJSON module
### Quick start
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
### Functions list
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

## Redis Times Series module
### Quick start
```
const client = new RedisTimesSeies({
    host: 'hostname',
    port: 43758,
});

//Connect to the Redis database with Redis Times Series module
await client.connect();

//Deleting a key
const response = await client.del('key');
expect(response).to.equal('OK', 'The response of the del command');

//Disconnect from the Redis database with Redis Times Series module
await client.disconnect();
```
### Functions list
| Functions  | Redis Times Series Command  |
|:---------- |:--------------------------- |
| create     | TS.CREATE                   |
| del        | DEL                         |
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

## Redisearch module
### Quick start
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
### Functions list
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

## RedisGraph module
### Quick start
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
### Functions list
| Functions     | RedisGraph Command  |
|:------------- |:------------------- |
| query         | GRAPH.QUERY         |
| readonlyQuery | GRAPH.RO_QUERY      |
| profile       | GRAPH.PROFILE       |
| delete        | GRAPH.DELETE        |
| explain       | GRAPH.EXPLAIN       |
| slowlog       | GRAPH.SLOWLOG       |

## RedisGears module
### Quick start
```
const client = new RedisGears({
    host: 'hostname',
    port: 43758,
});

//Connect to the Redis database with RedisGears module
await client.connect();

//Executing a query
const response = await client.query(graphName, 'CREATE (p:Person {name: \'Kurt\', age: 27}) RETURN p');
expect(response[2][0]).to.equal('Labels added: 1', 'The response of the GRAPH.QUERY command');

//Disconnect from the Redis database with RedisGears module
await client.disconnect();
```
### Functions list
| Functions          | RedisGears Command    |
|:------------------ |:--------------------- |
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
| pyexecute          | RG.PYEXECUTE          |
| pystats            | RG.PYSTATS            |
| pydumpreqs         | RG.PYDUMPREQS         |
| refreshCluster     | RG.REFRESHCLUSTER     |
| trigger            | RG.TRIGGER            |
| unregister         | RG.UNREGISTER         |