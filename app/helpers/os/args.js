import { argv } from 'process';

/** @type {string[]} */
const plugins = [];

let nextArgType = 0;
for(const arg of argv){
    switch(nextArgType){
        case 0:
            if(arg === '--plugin') nextArgType = 1;
            break;
        case 1:
            plugins.push(arg);
            nextArgType = 0;
            break;
    }
}

if(nextArgType !== 0) throw new Error('missing argument value');

export { plugins }
