# Contributing Guide

Hi! I'm happy that you are interested in contributing to Redis Modules SDK. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Pull Request Guidelines](#pull-request-guidelines)
- [Development](#development)
- [Continuous integration](#continuous-integration)
- [Deploy Bot](#deploy-bot)

## Pull Request Guidelines

- All relevant tests in the CI must pass
- For every newly added exported entity, please add it to the index.ts file
- For every newly added function, add tests coverage
- Make sure the merged commit and PR title are identical

## Development

### Setup
- Install [Node.js](http://nodejs.org) **version 8+**
- Clone the repo
- Inside the repo and run 
```bash
npm i #Install dependencies of the project
```

### Committing Changes
Each merged commit needs to be in the following format: `[Subject][Action] Description`
- Subject: Something that links the commit to a specific part of the project, i.e. RedisGears, README, ESLint .etc.
- Action: What was done, i.e. Bug Fix, Feature .etc.
- Description: A short description as a title of what was actually done via code

### Commonly used NPM scripts
``` bash
# Building the project using tsc
$ npm run build

# Running all existing tests
$ npm run tests

# Deploying a new NPM version
$ npm run deploy

# Running a specific test by path
$ npm run test <path> 
```

### Project structure
- **modules** folder - All Redis Modules SDK classes are located there
- **tests** folder - All Redis Modules SDK tests are located here
- **index.ts** - All exported classes/types/enums/interfaces are exported here
- **.github/docs** folder - All documentations are located here
- **.github/images** folder - All documentation related images
- **.github/workflows** folders - All GitHub workflows

## Continuous integration
- The CI auto triggers on pull request changes
- The CI triggers a 'Setup' job that verified linting and build and gathers edited files
- The CI selectively chooses which tests to run according to the changes done
- The CI has a workflow_dispatch where you can select all tests or specific ones, 'Setup' build is run by default.
- It is recommended you will open a PR only when most of the development is done, in order to prevent from running a lot of GitHub Action triggers.

![CI](https://github.com/danitseitlin/redis-modules-sdk/blob/master/.github/images/ci.png)

## Deploy Bot
- The Bot auto triggers on push to default (master) branch
- The Bot verified the package is buildable
- The Bot is deploying a new version using 'npm-package-deployer'. The versions are updated in a patch level. i.e. 0.1.9 -> 0.2.0 -> 0.2.1
