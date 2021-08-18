import { bold } from '../helpers/os/output.js';
import request from './jsonrpc.js';

export const hooks = (
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
    'balance',
    'transactions',
);

/**
 * @arg {keyof hooks} name
 * @arg {any} args
 * @return {Promise<[string, any][]>}
 */
async function callHooks(name, args){
    // @ts-ignore
    return Promise.all(hooks[name].map(async ([plugin, url]) => {
        try{
            return [plugin, await request(url, name, args)];
        } catch(e){
            console.error(`[${bold(plugin)}]: failed to call ${name}: ${e.message}`);
            return [plugin, undefined];
        }
    }));
}

export default function(){
}
