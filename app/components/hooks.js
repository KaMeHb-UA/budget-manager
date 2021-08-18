import { bold } from '../helpers/os/output.js';
import request from './jsonrpc.js';

const hooks = (
    /**
     * @template {string} T
     * @param  {...T} hooks
     */
    (...hooks) => {
        /** @type {{[x in T]: [string, string][]}} */
        // @ts-ignore
        const res = {};
        for(const name of hooks) res[name] = [];
        return res;
    }
)(
    // hook list
    'balance',
    'transactions',
    'currencies_rate',
    'publish',
    'db_get',
    'db_add',
    'db_update',
);

/**
 * @arg {keyof hooks} name
 * @arg {any} args
 * @return {Promise<{[x: string]: any}>}
 */
export default async function(name, args){
    const res = {};
    for(const [ plugin, result ] of await Promise.all(hooks[name].map(async ([plugin, url]) => {
        try{
            return [plugin, await request(url, name, args)];
        } catch(e){
            console.error(`[${bold(plugin)}]: failed to call ${name}: ${e.message}`);
            return [plugin, undefined];
        }
    }))) res[plugin] = result;
    return res;
}
