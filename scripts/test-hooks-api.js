import { argv, exit } from 'process';
import jsonrpc from '../app/components/jsonrpc.js';
import { isBalances, isTx } from '../app/components/types.js';

const url = argv[2],
    hook = argv[3];

const tests = {
    async balance(){
        const balances = await jsonrpc(url, 'balance');
        console.error(balances);
        if(!isBalances({
            provider: 'test-provider',
            balances,
        })) throw new Error;
    },
    async transactions(){
        const txs = await jsonrpc(url, 'transactions');
        console.error(txs);
        if(!Array.isArray(txs) || txs.map(isTx).includes(false)) throw new Error;
    },
};

try{
    await tests[hook]();
    console.log('OK');
} catch(e){
    console.error('Fail');
    exit(1);
}
