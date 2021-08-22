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
 * @arg {(op1: number, op2: number, precision?: number) => number} cb
 */
function baseOp(op1, op2, cb){
    const dad1 = digitsAfterDot(op1), dad2 = digitsAfterDot(op2);
    const targetPrecision = 10 ** (dad1 > dad2 ? dad1 : dad2);
    return cb(op1 * targetPrecision, op2 * targetPrecision, targetPrecision) / targetPrecision;
}

/**
 * @arg {number} op1
 * @arg {number} op2
 */
export function minus(op1, op2){
    return baseOp(op1, op2, (op1, op2) => op1 - op2)
}

/**
 * @arg {number} op1
 * @arg {number} op2
 */
export function plus(op1, op2){
    return baseOp(op1, op2, (op1, op2) => op1 + op2)
}
