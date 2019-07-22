import {createContext, useContext, useCallback} from 'react';

const noop = () => undefined;

const DEFAULT_VALUE = {
    cache: {},
    find: noop,
    fetch: noop,
    receive: noop,
    error: noop,
    expire: noop,
    saveSnapshot: noop,
    getSnapshot: noop,
};

export const Context = createContext(DEFAULT_VALUE);
Context.displayName = 'SuspenseBoundaryContext';

/* eslint-disable react-hooks/rules-of-hooks */
export const useResource = (actionOrMockValue, params) => {
    const {find, fetch, receive, error, expire} = useContext(Context);

    if (typeof actionOrMockValue !== 'function') {
        // 这里2个`useCallback`必须要，和后面的能对齐hook数量
        const refresh = useCallback(noop, []);
        const expire = useCallback(noop, []);
        return [actionOrMockValue, {refresh, expire}];
    }

    const query = find(actionOrMockValue, params);
    const runAction = useCallback(
        () => {
            const pending = actionOrMockValue(params);
            pending.then(
                value => receive(actionOrMockValue, params, value),
                reason => error(actionOrMockValue, params, reason)
            );
            return pending;
        },
        [actionOrMockValue, params, receive, error]
    );

    if (!query) {
        const pending = runAction();
        fetch(actionOrMockValue, params, pending);
        throw pending;
    }

    if (query.pending) {
        throw query.pending;
    }

    if (query.error) {
        throw query.error;
    }

    const expireCache = useCallback(
        () => expire(actionOrMockValue, params),
        [actionOrMockValue, expire, params]
    );

    return [
        query.data,
        {
            expire: expireCache,
            refresh: runAction,
        },
    ];
};
/* eslint-enable react-hooks/rules-of-hooks */

export const useSnapshot = (currentValue, initialValue) => {
    const {saveSnapshot, getSnapshot} = useContext(Context);
    saveSnapshot(currentValue, initialValue);
    return getSnapshot();
};
