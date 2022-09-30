import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisModules } from '../';
let redis: RedisModules;
const key1 = 'key1';
const key2 = 'key2';
const key3 = 'arrkey';
const path = '.';

describe('ReJSON Module testing', async function() {
    before(async () => {
        redis = new RedisModules({
            host: cliArguments.host,
            port: parseInt(cliArguments.port)
        }, { showDebugLogs: true });
        await redis.connect();
    })
    after(async () => {
        await redis.disconnect();
    })

    it('set function', async () => {
        let response = await redis.rejson_module_set(key1, path, '{"x": 1, "str": "yy"}');
        expect(response).to.equal('OK', 'The response of the set command');
        response = await redis.rejson_module_set(key2, path, '{"x": 3}');
        expect(response).to.equal('OK', 'The response of the set command');
        response = await redis.rejson_module_set(key3, path, '{"items": [1]}');
        expect(response).to.equal('OK', 'The response of the set command');
    });

    it('get function', async () => {
        let response = await redis.rejson_module_get(key1, path);
        expect(response).to.equal('{"x":1,"str":"yy"}', 'The response of the get command');
        response = await redis.rejson_module_get(key1, '$..x');
        expect(response).to.equal('[1]', 'The value of the X key')
    });
    
    it('mget function', async () => {
        const response = await redis.rejson_module_mget([key1, key2], path);
        expect(response).to.contain('{"x":1,"str":"yy"}', 'The response of the mget command');
        expect(response).to.contain('{"x":3}', 'The response of the mget command');
    });
    
    it('type function', async () => {
        const response = await redis.rejson_module_type(key1, path);
        expect(response).to.equal('object', 'The response of the type command')
    });
    
    it('numincrby function', async () => {
        const response = await redis.rejson_module_numincrby(key1, 2, '.x');
        expect(response).to.equal('3', 'The response of the numincrby command')
    });
    
    it('nummultby function', async () => {
        const response = await redis.rejson_module_nummultby(key1, 3, '.x');
        expect(response).to.equal('9', 'The response of the nummultby command')
    });
    
    it('strappend function', async () => {
        const response = await redis.rejson_module_strappend(key1, '"rrr"', '.str');
        expect(response).to.equal(5, 'The response of the strappend command');
        const string = await redis.rejson_module_get(key1, '.str');
        expect(string).to.equal('"yyrrr"', 'The response of the get command');
    });
    
    it('strlen function', async () => {
        const response = await redis.rejson_module_strlen(key1, '.str')
        expect(response).to.equal(5, 'The response of the strlen command');
    });
    
    it('arrappend function', async () => {
        const response = await redis.rejson_module_arrappend(key3, ['3','5','4','2'], '.items');
        expect(response).to.equal(5, 'The response of the arrappend command');
    });
    
    it('arrindex function', async () => {
        const response = await redis.rejson_module_arrindex(key3, '1', '.items');
        expect(response).to.equal(0, 'The response of the arrindex command');
    });
    
    it('arrinsert function', async () => {
        const response = await redis.rejson_module_arrinsert(key3, 1, '{"z": 5}', '.items');
        expect(response).to.equal(6, 'The response of the arrinsert command');
    });
    
    it('arrlen function', async () => {
        const response = await redis.rejson_module_arrlen(key3, '.items');
        expect(response).to.equal(6, 'The response of the arrlen command');
    });
    
    it('arrpop function', async () => {
        const response = await redis.rejson_module_arrpop(key3, 0, '.items');
        expect(response).to.equal('1', 'The response of the arrpop command');
    });
    
    it('arrtrim function', async () => {
        const response = await redis.rejson_module_arrtrim(key3, 0, 1, '.items');
        expect(response).to.equal(2, 'The response of the arrtrim command');
    });
    
    it('objkeys function', async () => {
        const response = await redis.rejson_module_objkeys(key1, path);
        expect(response.toString()).to.equal('x,str', 'The response of the objkeys command');
    });
    
    it('objlen function', async () => {
        const response = await redis.rejson_module_objlen(key1, path);
        expect(response).to.equal(2, 'The response of the objlen command');
    });
    
    it('debug function', async () => {
        const response = await redis.rejson_module_debug('MEMORY', key1, path);
        expect(response).to.be.greaterThan(0, 'The response of the debug command');
    });
    
    it('forget function', async () => {
        const response = await redis.rejson_module_forget(key2, path);
        expect(response).to.equal(1, 'The response of the forget command');
    });
    
    it('resp function', async () => {
        const response = await redis.rejson_module_resp(key1, path)
        expect(response.toString()).to.equal('{,x,9,str,yyrrr', 'The response of the resp command');
    });

    it('toggle function', async () => {
        const key = 'toggle'
        const path = '.x'
        await redis.rejson_module_set(key, '.', '{"x": false, "str": "yy"}');
        const response = await redis.rejson_module_toggle(key, path);
        expect(response).to.equal('true', 'The response of JSON.TOGGLE')
    })

    it('clear function', async () => {
        const key = 'clear'
        const path = '.'
        await redis.rejson_module_set(key, path, '{"x": 1, "str": "yy"}');
        const response = await redis.rejson_module_clear(key, path);
        expect(response).to.equal(1, 'The response of JSON.CLEAR')
    })

    it('del function', async () => {
        const response = await redis.rejson_module_del(key1, path);
        expect(response).to.equal(1, 'The response of the del command');
    });
});