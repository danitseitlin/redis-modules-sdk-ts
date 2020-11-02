# Redis modules project
A project meant for connecting to Redis databases with modules easily, built with Typescript.

## ReJSON module
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

//Setting a key
const response = await client.del('key');
expect(response).to.equal('OK', 'The response of the set command');

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
| createRule | TS.CREATERULE               |
| deleteRule | TS.DELETERULE               |
| range      | TS.RANGE                    |
| revrange   | TS.REVRANGE                 |
| mrange     | TS.MRANGE                   |
| mrevrange  | TS.MREVRANGE                |
| get        | TS.GET                      |
| mget       | TS.MGET                     |
| info       | TS.INFO                     |
| queryindex | TS.QUERYINDEX               |