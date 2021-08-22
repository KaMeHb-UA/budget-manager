import asyncInterval from '../helpers/os/async-interval.js';
import { add } from './db.js';
import callHook from './hooks.js';
import getIcon from './mcc-icons.js';
import getNewTxs from './txs.js';

async function publish(type, data){
    await callHook('publish', { type, data });
}

async function currencyInfo(code){
    const resp = await callHook('currency_info', { code });
    for(const provider in resp) return resp[provider];
}

export default () => asyncInterval(true, async () => {
    const txs = await getNewTxs();
    for(const tx of txs){
        await add('transactions', tx);
        const currency = await currencyInfo(tx.currency);
        await publish('new_tx', {
            provider: tx.provider,
            icon: getIcon(tx.mcc),
            currency_prefix: currency.symbol,
            currency_suffix: currency.symbol ? '' : ` ${tx.currency}`,
            description: tx.description,
            amount: tx.amount,
            comission: tx.comission,
            cashback: tx.cashback,
            rest_balance: tx.restBalance,
        });
    }
}, 60000)
