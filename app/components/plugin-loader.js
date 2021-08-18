import request from './jsonrpc.js';
import hooks from './hooks.js';
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

const dbHooksRegistered = {};

export function isDBRegistered(){
    let res = true;
    for(const hook in dbHooksRegistered) res &&= dbHooksRegistered[hook];
    return res;
}

function checkDBHooks(hook){
    switch(hook){
        case 'db_get':
        case 'db_add':
            if(dbHooksRegistered[hook]) return false;
            dbHooksRegistered[hook] = true;
            return true;
        default:
            return true;
    }
}

/** @type {string[]} */
const registered = [];

/**
 * @arg {string} url
 */
export default async url => {
    const res = await request(url, 'register');
    if(!isRegisterResult(res)) throw new TypeError(`Cannot register plugin ${url}: register method returned invalid value. Possible value is {name: string, hooks: string[]}`);
    if(registered.includes(res.name)) throw new TypeError(`Cannot register plugin ${url}: name ${res.name} is taken by another plugin`);
    registered.push(res.name);
    const registeredHooks = [];
    for(const hook of res.hooks){
        if(checkDBHooks(hook)){
            const regArr = hooks[hook];
            if(regArr){
                regArr.push([res.name, url]);
                registeredHooks.push(hook);
            }
            else console.error(`[${bold(res.name)}]: warning: unknown hook ${hook}, skipping`);
        } else console.error(`[${bold(res.name)}]: warning: cannot register hook ${hook}: there may be only one such hook registered, skipping`);
    }
    return { name: res.name, hooks: registeredHooks };
}
