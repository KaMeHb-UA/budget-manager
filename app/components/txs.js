import { get } from './db.js';
import callHooks from './hooks.js';
import { minus, plus } from '../helpers/os/math.js';
import { isBalances, isTx } from './types.js';
import logger from '../helpers/os/logger.js';

/** @typedef {import('./types').Tx} Tx */
/** @typedef {import('./types').Balances} Balances */

/**
 * @typedef Change
 * @property {string} provider
 * @property {string} currency
 * @property {number} amount
 * @property {string} accountId
 * @property {string} savedId
 */

/**
 * @arg {any} data
 * @return {data is Tx[]}
 */
function isTxArr(data){
    return Array.isArray(data) && !data.map(tx => isTx(tx)).includes(false)
}

/** @arg {Tx[]} txs */
function fillTxGaps(txs, provider){
    const res = [];
    const splitted = splitTxsByAcc(txs);
    for(const acc in splitted){
        const txs = splitted[acc];
        res.push(txs[0]);
        for(let i = 1; i < txs.length; i++){
            const diff = minus(txs[i].restBalance, txs[i - 1].restBalance);
            const hiddenDiff = minus(txs[i].amount, diff);
            if(hiddenDiff){
                const currency = txs[i].currency || txs[i - 1].currency;
                logger.warn(provider, `found hidden tx with amount of ${hiddenDiff} ${currency}`);
                res.push({
                    amount: hiddenDiff,
                    description: '<hidden_tx>',
                    time: -1,
                    id: '',
                    comission: 0,
                    cashback: 0,
                    restBalance: plus(txs[i - 1].restBalance, hiddenDiff),
                    currency,
                    mcc: 0,
                    accountId: acc,
                });
            }
            res.push(txs[i]);
        }
    }
    return res;
}

/** @arg {Tx[]} txs */
function splitTxsByAcc(txs){
    /** @type {{[accountId: string]: Tx[]}} */
    const res = {};
    for(const tx of txs){
        if(!(tx.accountId in res)) res[tx.accountId] = [];
        res[tx.accountId].push(tx);
    }
    return res;
}

/**
 * @arg {string} provider
 * @arg {any} providerTxs
 * @arg {Change[]} changes
 * @return {Promise<Tx[]>}
 */
async function getNewTxs(provider, providerTxs, changes){
    if(!isTxArr(providerTxs)){
        logger.error(provider, 'transactions returned in unknown format');
        return [];
    }
    const lastSavedTxs = [];
    const lastBalanceTxs = [];
    await Promise.all(changes.map(async change => {
        lastBalanceTxs.push({
            amount: 0,
            restBalance: change.amount,
            accountId: change.accountId,
            __special: true,
        });
        const dbTxs = await get('transactions', {
            reverse: true,
            limit: 1,
            filters: [
                [
                    'provider',
                    '=',
                    provider,
                ],
                [
                    'accountId',
                    '=',
                    change.accountId,
                ],
                [
                    'id',
                    '!=',
                    '',
                ],
            ],
        });
        if('error' in dbTxs){
            logger.error(dbTxs.provider, dbTxs.error);
            return [];
        }
        const tx = dbTxs.data[0]?.data;
        if(tx) lastSavedTxs.push(Object.assign(tx, { __special: true }));
    }));
    const providerTxsByAcc = splitTxsByAcc(providerTxs);
    const newTxs = [];
    for(const acc in providerTxsByAcc){
        const lastSavedTxId = lastSavedTxs.filter(tx => tx.accountId === acc)[0]?.id || Symbol();
        const txs = providerTxsByAcc[acc];
        const found = txs.filter(tx => tx.id === lastSavedTxId)[0];
        newTxs.push(...(
            found
            ? txs.slice(txs.indexOf(found) + 1)
            : txs
        ))
    }
    // @ts-ignore
    return fillTxGaps([...lastSavedTxs, ...newTxs, ...lastBalanceTxs], provider).filter(tx => !tx.__special);
}

export default async function(){
    // Changed balance is the reason to check for new txs.
    // Unlike crypto, some banks can hide some txs, but balance changes.
    // In that case we can assume that we have some hidden transaction(s?)
    const [ dbBalances, providerBalances ] = await Promise.all([
        get('balances'),
        callHooks('balance'),
    ]);
    if('error' in dbBalances){
        logger.error(dbBalances.provider, dbBalances.error);
        return [];
    }
    /** @type {Change[]} */
    const changes = [];
    for(const provider in providerBalances){
        const balancesToCheck = {
            provider,
            balances: providerBalances[provider],
        };
        if(!isBalances(balancesToCheck)){
            logger.error(provider, 'balance data returned in unknown format');
            continue;
        }
        const savedBalances = dbBalances.data.filter(({data}) => data?.provider === provider)[0];
        if(savedBalances && !isBalances(savedBalances.data)){
            logger.error(provider, `balance data for provider '${provider}' returned in unknown format`);
            continue;
        }
        const currentBalances = balancesToCheck.balances;
        for(const currentBalance of currentBalances){
            const savedBalance = savedBalances?.data?.balances?.[currentBalance.id]?.amount || 0;
            if(currentBalance.amount === savedBalance) continue;
            changes.push({
                provider,
                currency: currentBalance.currency,
                amount: minus(currentBalance.amount, savedBalance),
                accountId: currentBalance.id,
                savedId: savedBalances?.id,
            });
        }
    }
    if(!changes.length) return [];
    const providerTxs = await callHooks('transactions');
    const newTxs = [];
    for(const txs of await Promise.all(Object.keys(providerTxs).map(async provider => {
        const txs = await getNewTxs(provider, providerTxs[provider], changes.filter(v => v.provider === provider));
        return txs.map(tx => Object.assign(tx, { provider }));
    }))) for(const tx of txs) newTxs.push(tx);
    if(newTxs.length) logger.log(null, `found ${newTxs.length} new transactions`);
    return newTxs;
}
