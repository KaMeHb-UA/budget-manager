import request from './jsonrpc.js';
import { hooks } from './core.js';
import { bold } from '../helpers/os/output.js';

/**
 * @arg {any} arg
 * @return {arg is string[]}
 */
function isStrArr(arg){
    return Array.isArray(arg) && arg.reduce((acc, c) => acc && typeof c === 'string', true);
}

/**
 * @arg {any} arg
 * @return {arg is {name: string, hooks: string[]}}
 */
function isRegisterResult(arg){
    return typeof arg === 'object' && arg !== null && typeof arg.name === 'string' && isStrArr(arg.hooks);
}

/**
 * @arg {string} url
 */
export default async url => {
    const res = await request(url, 'register');
    if(!isRegisterResult(res)) throw new TypeError(`cannot register plugin ${url}: register method returned invalid value. Possible value is {name: string, hooks: string[]}`);
    const registeredHooks = [];
    for(const hook of res.hooks){
        const regArr = hooks[hook];
        if(regArr){
            regArr.push([res.name, url]);
            registeredHooks.push(hook);
        }
        else console.error(`[${bold(res.name)}]: warning: unknown hook ${hook}, skipping`);
    }
    return { name: res.name, hooks: registeredHooks };
}
