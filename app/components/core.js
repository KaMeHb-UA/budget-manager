import { bold } from '../helpers/os/output.js';
import request from './jsonrpc.js';
import hooks from './hooks.js';

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
