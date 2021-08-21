import { stdout, stderr } from 'process';
import { bold, red } from './output';

export default new class{
    /**
     * @arg {string} provider
     * @arg {string} text
     * @arg {NodeJS.WriteStream} dest
     */
    #baseWriter(provider, text, dest){
        dest.write(`[${
            provider
            ? bold(provider)
            : red('core')
        }]: ${text}\n`);
    }
    /**
     * @arg {string} provider
     * @arg {string} text
     */
    log(provider, text){
        this.#baseWriter(provider, text, stdout);
    }
    /**
     * @arg {string} provider
     * @arg {string} text
     */
    warn(provider, text){
        this.#baseWriter(provider, `warning: ${text}`, stderr);
    }
    /**
     * @arg {string} provider
     * @arg {string} text
     */
    error(provider, text){
        this.#baseWriter(provider, `error: ${text}`, stderr);
    }
}
