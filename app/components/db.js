import callHooks from './hooks.js';
import { isDbGetResp } from './types.js';

/**
 * @arg {`db_${'get' | 'add' | 'update'}`} hook
 * @arg {any} data
 */
async function call(hook, data){
    const v = await callHooks(hook, data);
    const provider = Object.keys(v)[0];
    return [ v[provider], provider ];
}

/**
 * @arg {any} options
 * @return {Promise<{provider: string, data: {id: string, data: any}[]} | {provider: string, error: string}>}
 */
export async function get(options){
    const [ data, provider ] = await call('db_get', options);
    if(!isDbGetResp(data)) return {
        provider,
        error: 'db_get returned response in unknown format',
    };
    return {
        provider,
        data,
    };
}

/**
 * @arg {string} table
 * @arg {any} data
 * @return {Promise<{provider: string, id: string} | {provider: string, error: string}>}
 */
export async function add(table, data){
    const [ id, provider ] = await call('db_add', { table, data });
    if(typeof id !== 'string') return {
        provider,
        error: 'db_add returned response in unknown format',
    };
    return {
        provider,
        id,
    };
}

/**
 * @arg {string} table
 * @arg {string} id
 * @arg {any} data
 * @return {Promise<{provider: string} | {provider: string, error: string}>}
 */
export async function update(table, id, data){
    const [ res, provider ] = await call('db_update', { table, id, data });
    if(res !== null && res !== undefined) return {
        provider,
        error: 'db_update returned response in unknown format',
    };
    return {
        provider,
    };
}
