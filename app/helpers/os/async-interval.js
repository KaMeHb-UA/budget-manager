import sleep from './sleep.js';

/**
 * @template {any[]} T
 * @arg {boolean} runImmediate
 * @arg {(...args: T) => Promise<void>} cb
 * @arg {number} ms
 * @arg {T} args
 * @return {() => void}
 */
export default (runImmediate, cb, ms, ...args) => {
    let next = true;
    void async function(){
        if(!runImmediate) await sleep(ms);
        while(next){
            await cb(...args);
            await sleep(ms);
        }
    }()
    return () => { next = false };
}
