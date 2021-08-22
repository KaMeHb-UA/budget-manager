import { argv, exit } from 'process';
import jsonrpc from '../app/components/jsonrpc.js';
import { isBalances, isTx } from '../app/components/types.js';

const url = argv[2],
    hook = argv[3];

const tests = {
    async balance(){
        let balances;
        try{
            balances = await jsonrpc(url, 'balance');
        } catch(e){
            console.error(e);
        }
        console.error(balances);
        if(!isBalances({
            provider: 'test-provider',
            balances,
        })) throw new Error;
    },
    async transactions(){
        let txs;
        try{
            txs = await jsonrpc(url, 'transactions');
        } catch(e){
            console.error(e);
        }
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
