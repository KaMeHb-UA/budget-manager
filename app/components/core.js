export const hooks = (
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
    'balance',
    'transactions',
);

export default function(){
}
