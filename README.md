# Redis modules project
A project meant for connecting to Redis databases with modules easily, built with Typescript.

## ReJSON module
### Quick start
```
const client = new ReJSON({
    host: 'hostname',
    port: 43758,
});
```
### Functions list
| Functions        | ReJSON Command  |
|:---------------- |:--------------- |
| delCommand       | JSON.DEL        |
| getCommand       | JSON.GET        |
| mgetCommand      | JSON.MGET       |
| setCommand       | JSON.SET        |
| typeCommand      | JSON.TYPE       |
| numincrbyCommand | JSON.NUMINCRBY  |
| nummultbyCommand | JSON.NUMMULTBY  |
| strappendCommand | JSON.STRAPPEND  |
| strlenCommand    | JSON.STRLEN     |
| arrappendCommand | JSON.ARRAPPEND  |
| arrindexCommand  | JSON.ARRINDEX   |
| arrinsertCommand | JSON.ARRINSERT  |
| arrlenCommand    | JSON.ARRLEN     |
| arrpopCommand    | JSON.ARRPOP     |
| arrtrimCommand   | JSON.ARRTRIM    |
| objkeysCommand   | JSON.OBJKEYS    |
| objlenCommand    | JSON.OBJLEN     |
| debugCommand     | JSON.DEBUG      |
| forgetCommand    | JSON.FORGET     |
| respCommand      | JSON.RESP       |