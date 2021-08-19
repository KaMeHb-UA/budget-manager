import { get } from './db.js';
import callHooks from './hooks.js';
import { minus } from '../helpers/os/math.js';
import { isBalanceData } from './types';
import { bold } from '../helpers/os/output.js';

/** @typedef {import('./types').Tx} Tx */
/** @typedef {import('./types').BalanceData} BalanceData */

/**
 * @return {Promise<Tx[]>}
 */
export async function checkForNewTxs(){
    // Changed balance is the reason to check for new txs.
    // Unlike crypto, some banks can hide some txs, but balance will change.
    // In that case we can assume that we have some hidden transaction(s?)
    const [ dbBalances, providerBalances ] = await Promise.all([
        get({
            table: 'balances',
        }),
        callHooks('balance'),
    ]);
    if('error' in dbBalances){
        console.error(`[${bold(dbBalances.provider)}]: error: ${dbBalances.error}`)
        return [];
    }
    const changes = [];
    for(const provider in providerBalances){
        const currentBalances = providerBalances[provider];
        if(!isBalanceData({
            provider,
            balances: currentBalances,
        })){
            console.log(`[${bold(provider)}]: error: balance data returned in unknown format`);
            continue;
        }
        const savedBalances = dbBalances.data.filter(({data}) => data?.provider === provider)[0];
        if(savedBalances && !isBalanceData(savedBalances.data)){
            console.log(`[${bold(dbBalances.provider)}]: error: balance data for provider '${provider}' returned in unknown format`);
            continue;
        }
        for(const currency in currentBalances){
            const currentBalance = currentBalances[currency], savedBalance = savedBalances?.data?.balances?.[currency] || 0;
            if(currentBalance === savedBalance) continue;
            changes.push([provider, currency, minus(currentBalance, savedBalance), savedBalances?.id]);
        }
    }
    if(!changes.length) return [];
    //const [ dbTxs, providerTxs ] 
}
