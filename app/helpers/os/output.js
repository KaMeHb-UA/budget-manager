/**
 * @arg {string} str
 */
export function bold(str){
    return `\u001b[1m${str}\u001b[0m`;
}

/**
 * @arg {string} str
 */
export function red(str){
    return `\u001b[31;1m${str}\u001b[0m`;
}
