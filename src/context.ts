import {createContext, useContext, useCallback} from 'react';
import invariant from 'tiny-invariant';

export type Fetch<I, O> = (args: I) => Promise<O>;

interface ResourceController {
    refresh(): void;
    expire(): void;
}

export type Resource<T> = [T, ResourceController];

export interface Query<T> {
    pending?: Promise<void>;
    error?: Error;
    data?: T;
}

export interface SuspenseContext {
    find<I, O>(action: Fetch<I, O>, args: I): Query<O>;
    fetch<I, O>(action: Fetch<I, O>, params: I, pending: Promise<void>): void;
    receive<I, O>(action: Fetch<I, O>, params: I, data: O): void;
    error<I, O>(action: Fetch<I, O>, params: I, reason: Error): void;
    expire<I, O>(action: Fetch<I, O>, params: I): void;
    saveSnapshot<T>(currentValue: T, initialValue: T): void;
    getSnapshot<T>(): T;
}

const noop = () => undefined;

export const Context = createContext<SuspenseContext | null>(null);
Context.displayName = 'SuspenseBoundaryContext';

const isMock = <I, O>(actionOrMockValue: Fetch<I, O> | O): actionOrMockValue is O => {
    return typeof actionOrMockValue !== 'function';
};

/* eslint-disable react-hooks/rules-of-hooks */
export const useResource = <I, O>(actionOrMockValue: Fetch<I, O> | O, params: I): Resource<O> => {
    const suspenseContext = useContext(Context);
    invariant(suspenseContext, 'You should not use useResource outside a <Boundary>');
    const {find, fetch, receive, error, expire} = suspenseContext as SuspenseContext;

    if (isMock(actionOrMockValue)) {
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
        query.data as O,
        {
            expire: expireCache,
            refresh: runAction,
        },
    ];
};
/* eslint-enable react-hooks/rules-of-hooks */

export const useResourceWithMock = <I, O>(actionOrMockValue: Fetch<I, O> | O, mockValue: O, params: I): Resource<O> => {
    try {
        return useResource(actionOrMockValue, params);
    }
    catch (ex) {
        if (typeof ex.then === 'function') {
            return [
                mockValue,
                {
                    expire: noop,
                    refresh: noop,
                },
            ];
        }
        throw ex;
    }
};

export const useSnapshot = <T>(currentValue: T, initialValue: T): T => {
    const suspenseContext = useContext(Context);
    invariant(suspenseContext, 'You should not use useSnapshot outside a <Boundary>');
    const {saveSnapshot, getSnapshot} = suspenseContext as SuspenseContext;
    saveSnapshot(currentValue, initialValue);
    return getSnapshot();
};
