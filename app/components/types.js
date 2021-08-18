/**
 * @typedef BalanceData
 * @property {string} provider
 * @property {{[x: string]: number}} balances
 */
/**
 * @typedef Tx
 * @property {string} provider
 * @property {number} amount
 * @property {string} description
 * @property {number} time
 * @property {string} id
 * @property {number} comission
 * @property {number} cashback
 * @property {number} restBalance
 * @property {string} currency
 */

/**
 * @arg {any} obj
 * @arg {string[]} props
 * @arg {string} type
 */
function assume(obj, props, type){
    const types = props.map(i => typeof obj[i]).reduce((acc, curr) => (!acc.includes(curr) && acc.push(curr), acc), []);
    return types.length === 1 && types[0] === type;
}

/**
 * @arg {any} data
 * @return {data is {[x: string]: any}}
 */
export function isObj(data){
    return typeof data === 'object' && data !== null;
}

/**
 * @arg {any} data
 * @return {data is BalanceData}
 */
export function isBalanceData(data){
    return isObj(data)
        && typeof data.provider === 'string'
        && isObj(data.balances)
        && Object.keys(data.balances).reduce((acc, i) => acc && typeof data.balances[i] === 'number', true)
}

/**
 * @arg {any} data
 * @return {data is Tx}
 */
export function isTx(data){
    return isObj(data)
        && assume(data, ['provider', 'description', 'id', 'currency'], 'string')
        && assume(data, ['amount', 'time', 'comission', 'cashback', 'restBalance'], 'number')
}
