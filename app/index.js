import registerPlugin, { isDBRegistered } from './components/plugin-loader.js';
import { plugins } from './helpers/os/args.js';
import { bold, red } from './helpers/os/output.js';
import run from './components/core.js';
import { exit } from 'process';

await Promise.all(plugins.map(async url => {
    try{
        console.log(`[${red('core')}]: registering plugin from ${url}...`);
        const { name, hooks } = await registerPlugin(url);
        if(hooks.length) console.log(`[${bold(name)}]: plugin registered successfully with hooks ${hooks.join(', ')}`);
        else {
            console.error(`[${bold(name)}]: error: cannot register plugin: there is no compatible hooks`);
            exit(1);
        }
    } catch(e){
        console.error(`[${red('core')}]: error: cannot register plugin from ${url}: ${e.message}`);
        exit(1);
    }
}));

if(!isDBRegistered()){
    console.error(`[${red('core')}]: error: start core without DB plugin. Please, add one`);
    exit(1);
}

void run();
