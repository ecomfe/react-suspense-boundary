import {createContext, useContext, useCallback, useEffect} from 'react';
import invariant from 'tiny-invariant';
import {useForceUpdate} from '@huse/update';
import SuspenseError from './SuspenseError';
import {CacheMode} from './Cache';
import {Scope, findCache} from './CacheManager';
import {stringifyKey} from './utils';

export type Fetch<I, O> = (args: I) => Promise<O>;

export interface ResourceController {
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
    scope: Scope;
    cacheMode: CacheMode;
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
    const forceUpdate = useForceUpdate();
    const keyString = stringifyKey(params);

    if (!suspenseContext) {
        throw new Error('You should not use useResource outside a <Boundary>');
    }

    const cache = findCache(suspenseContext.scope, suspenseContext.cacheMode);

    useEffect(
        () => {
            const update = (action: any, key: any) => {
                if (action === actionOrMockValue && stringifyKey(key) === keyString) {
                    forceUpdate();
                }
            };
            const unsubscribe = cache.subscribe(update);
            return unsubscribe;
        },
        [actionOrMockValue, cache, forceUpdate, keyString]
    );

    if (isMock(actionOrMockValue)) {
        // These 2 `useCallback`s are required to align hooks order and count.
        const refresh = useCallback(noop, [actionOrMockValue, params, cache]);
        const expireCache = useCallback(noop, [actionOrMockValue, params, cache]);
        return [actionOrMockValue, {refresh, expire: expireCache}];
    }

    const query = cache.find(actionOrMockValue, params);
    const runAction = useCallback(
        () => {
            const pending = actionOrMockValue(params).then(
                value => cache.receive(actionOrMockValue, params, value),
                reason => cache.error(actionOrMockValue, params, reason)
            );
            cache.fetch(actionOrMockValue, params, pending);
            return pending;
        },
        [actionOrMockValue, params, cache]
    );
    const expireCache = useCallback(
        () => cache.expire(actionOrMockValue, params),
        [actionOrMockValue, params, cache]
    );

    if (!query) {
        const pending = runAction();
        throw pending;
    }

    if (query.data) {
        return [
            query.data,
            {
                expire: expireCache,
                refresh: runAction,
            },
        ];
    }

    if (query.pending) {
        throw query.pending;
    }

    if (query.error) {
        throw new SuspenseError(actionOrMockValue, params, query.error);
    }

    throw new Error('Unexpected suspense state without data, pending and error');
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
