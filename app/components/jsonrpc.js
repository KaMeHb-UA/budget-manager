import request from '../helpers/net/request.js';

/**
 * @arg {string} entry
 * @arg {string} method
 * @arg {{[x in string | number]: any} | any[]=} args
 */
export default async function(entry, method, args = {}){
    const res = JSON.parse(await request(entry, JSON.stringify({
        jsonrpc: '2.0',
        method,
        params: args,
        id: 0,
    })));
    if(res.error) throw new Error(`${res.error.code}: ${res.error.message}`);
    return res.result;
}
