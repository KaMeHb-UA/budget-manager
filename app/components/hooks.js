export default (
    /**
     * @template {string} T
     * @param  {...T} hooks
     */
    (...hooks) => {
        /** @type {{[x in T]: [string, string][]}} */
        // @ts-ignore
        const res = {};
        for(const name of hooks) res[name] = [];
        return res;
    }
)(
    // hook list
    'balance',
    'transactions',
    'currencies_rate',
    'publish',
    'db_get',
    'db_add',
);
