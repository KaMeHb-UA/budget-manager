import sleep from './sleep.js';

/**
 * @template {any[]} T
 * @arg {(...args: T) => Promise<void>} cb
 * @arg {number} ms
 * @arg {T} args
 * @return {() => void}
 */
export default (cb, ms, ...args) => {
    let next = true;
    void async function(){
        await sleep(ms);
        while(next){
            await cb(...args);
            await sleep(ms);
        }
    }()
    return () => { next = false };
}
