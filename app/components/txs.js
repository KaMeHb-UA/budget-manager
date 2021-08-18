import { get } from './db.js';
import callHooks from './hooks.js';
import { minus } from '../helpers/os/math.js';

/**
 * @typedef BalanceData
 * @property {string} provider
 * @property {{[x: string]: number}} balances
 */

export async function checkForNewTxs(){
    // Changed balance is the reason to check for new txs.
    // Unlike crypto, some banks can hide some txs, but balance will change.
    // In that case we can assume that we have some hidden transaction(s?)
    /** @type {[{id: string, data: BalanceData}[], {[provider: string]: BalanceData['balances']}]} */
    const [ dbBalances, providerBalances ] = await Promise.all([
        get({
            table: 'balances',
        }),
        callHooks('balance'),
    ]);
    const changes = [];
    for(const provider in providerBalances){
        const currentBalances = providerBalances[provider];
        const savedBalances = dbBalances.filter(({data}) => data.provider === provider)[0];
        for(const currency in currentBalances){
            const currentBalance = currentBalances[currency], savedBalance = savedBalances?.data?.balances?.[currency] || 0;
            if(currentBalance === savedBalance) continue;
            changes.push([provider, currency, minus(currentBalance, savedBalance), savedBalances?.id]);
        }
    }
    if(!changes.length) return [];
    //const [ dbTxs, providerTxs ] 
}
