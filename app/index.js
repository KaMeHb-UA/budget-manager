import registerPlugin, { isDBRegistered } from './components/plugin-loader.js';
import { plugins } from './helpers/os/args.js';
import { bold } from './helpers/os/output.js';
import run from './components/core.js';

await Promise.all(plugins.map(async url => {
    console.log(`Registering plugin at ${url}...`);
    const { name, hooks } = await registerPlugin(url);
    if(hooks.length) console.log(`[${bold(name)}]: plugin registered successfully with hooks ${hooks.join(', ')}`);
    else console.error(`[${bold(name)}]: error: cannot register plugin: there is no compatible hooks`);
}));

if(!isDBRegistered()) throw new Error('Cannot start core without DB plugin. Please, add one');

void run();
