import {createContext, useContext, useCallback} from 'react';
import invariant from 'tiny-invariant';

const noop = () => undefined;

export const Context = createContext(null);
Context.displayName = 'SuspenseBoundaryContext';

/* eslint-disable react-hooks/rules-of-hooks */
export const useResource = (actionOrMockValue, params) => {
    const suspenseContext = useContext(Context);
    invariant(suspenseContext, 'You should not use useResource outside a <Boundary>');
    const {find, fetch, receive, error, expire} = suspenseContext;

    if (typeof actionOrMockValue !== 'function') {
        // 这里2个`useCallback`必须要，和后面的能对齐hook数量
        const refresh = useCallback(noop, [actionOrMockValue, params, fetch, receive, error]);
        const expireCache = useCallback(noop, [actionOrMockValue, expire, params]);
        return [actionOrMockValue, {refresh, expire: expireCache}];
    }

    const query = find(actionOrMockValue, params);
    const runAction = useCallback(
        () => {
            const pending = actionOrMockValue(params).then(
                value => receive(actionOrMockValue, params, value),
                reason => error(actionOrMockValue, params, reason)
            );
            fetch(actionOrMockValue, params, pending);
            return pending;
        },
        [actionOrMockValue, params, fetch, receive, error]
    );

    if (!query) {
        const pending = runAction();
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
    const suspenseContext = useContext(Context);
    invariant(suspenseContext, 'You should not use useSnapshot outside a <Boundary>');
    const {saveSnapshot, getSnapshot} = suspenseContext;
    saveSnapshot(currentValue, initialValue);
    return getSnapshot();
};
