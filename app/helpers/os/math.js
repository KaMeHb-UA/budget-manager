/*!
 * Fixed math module
 */

/**
 * @arg {number} num
 */
function digitsAfterDot(num){
    return ((num + '').split('.')[1] || '').length;
}

/**
 * @arg {number} op1
 * @arg {number} op2
 */
export function minus(op1, op2){
    return +(op1 - op2).toFixed(Math.max(digitsAfterDot(op1), digitsAfterDot(op2)));
}

/**
 * @arg {number} op1
 * @arg {number} op2
 */
export function plus(op1, op2){
    return +(op1 + op2).toFixed(Math.max(digitsAfterDot(op1), digitsAfterDot(op2)));
}
