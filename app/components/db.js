import callHooks from './hooks.js';

/**
 * @arg {`db_${'get' | 'add' | 'update'}`} hook
 * @arg {any} data
 * @return {Promise<any>}
 */
async function call(hook, data){
    const v = await callHooks(hook, data);
    return v[Object.keys(v)[0]];
}

/**
 * @arg {any} options
 * @return {Promise<{id: string, data: any}[]>}
 */
export async function get(options){
    return call('db_get', options);
}

/**
 * @arg {string} table
 * @arg {any} data
 * @return {Promise<string>}
 */
export async function add(table, data){
    return call('db_add', { table, data });
}

/**
 * @arg {string} table
 * @arg {string} id
 * @arg {any} data
 */
export async function update(table, id, data){
    await call('db_update', { table, id, data });
}
