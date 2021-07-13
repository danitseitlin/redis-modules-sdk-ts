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
  <img src='https://github.com/danitseitlin/redis-modules-sdk/blob/master/.github/images/logo.png' />
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
Come and read our documentation [here](https://github.com/danitseitlin/redis-modules-sdk/blob/master/docs/doc.md#documentation-book) before starting
* [Redis All in One](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#redis-all-in-one-feature)
* [ReJSON](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#-rejson-module)
* [RedisTimeSeries](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#-redistimeseries-module) (RTS)
* [RediSearch](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#-redisearch-module)
* [RedisGraph](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#-redisgraph-module)
* [RedisGears](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#-redisgears-module)
* [RedisBloom](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#bloom-filter)
* [RedisAI](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#-redisai-module)
* [RedisIntervalSets](https://github.com/danitseitlin/redis-modules-sdk-ts/blob/master/docs/doc.md#ris-module)

# Redis "All in One"! :scream:
A class built for integrating more than one Redis module without creating more than one class!
```
const client = new Redis(....);
await client.connect();
await client.ai_module_tensorset(...);
await client.ris_module_add(...);
await client.disconnect();
```
All modules are supported! :fire:

# Supported modules :dark_sunglasses:
* [ReJSON](https://github.com/RedisJSON/RedisJSON)
* [RedisTimeSeries](https://github.com/RedisTimeSeries/RedisTimeSeries) (RTS)
* [RediSearch](https://github.com/RediSearch/RediSearch)
* [RedisGraph](https://github.com/RedisGraph/RedisGraph)
* [RedisGears](https://github.com/RedisGears/RedisGears)
* [RedisBloom](https://github.com/RedisBloom/RedisBloom)
* [RedisAI](https://github.com/RedisAI/RedisAI)
* [RedisIntervalSets](https://github.com/danitseitlin/redis-interval-sets)

# Contributing :raised_hands:
Interested in contributing? awesome! start with reading our guidelines [here](https://github.com/danitseitlin/redis-modules-sdk/blob/master/docs/contributing.md#contributing-guide)

# Supporters :open_hands:
[![Stargazers repo roster for @danitseitlin/redis-modules-sdk](https://reporoster.com/stars/danitseitlin/redis-modules-sdk)](https://github.com/danitseitlin/redis-modules-sdk/stargazers)
