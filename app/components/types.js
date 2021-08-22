/**
 * @typedef Balances
 * @property {string} provider
 * @property {{type: 'personal' | 'business', amount: number, currency: string, id: string}[]} balances
 */
/**
 * @typedef Tx
 * @property {number} amount
 * @property {string} description
 * @property {number} time
 * @property {string} id
 * @property {number} comission
 * @property {number} cashback
 * @property {number} restBalance
 * @property {string} currency
 * @property {number} mcc
 * @property {string} accountId
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
 * @return {data is Balances['balances'][0]}
 */
export function isBalanceData(data){
    return isObj(data)
        && typeof data.amount === 'number'
        && ['personal', 'business'].includes(data.type)
        && typeof data.currency === 'string'
        && typeof data.id === 'string'
}

/**
 * @arg {any} data
 * @return {data is Balances}
 */
export function isBalances(data){
    return isObj(data)
        && typeof data.provider === 'string'
        && Array.isArray(data.balances)
        && data.balances.map(isBalanceData).indexOf(false) === -1
}

/**
 * @arg {any} data
 * @return {data is Tx}
 */
export function isTx(data){
    return isObj(data)
        && assume(data, ['description', 'id', 'currency', 'accountId'], 'string')
        && assume(data, ['amount', 'time', 'comission', 'cashback', 'restBalance', 'mcc'], 'number')
}

/**
 * @arg {any} data
 * @return {data is { id: string, data: any }[]}
 */
export function isDbGetResp(data){
    return Array.isArray(data)
        && data.reduce((correct, data) => correct && isObj(data) && typeof data.id === 'string', true)
}
