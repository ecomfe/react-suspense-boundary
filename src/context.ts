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

interface ContextEntry {
    scope: Scope;
    cacheMode: CacheMode;
}

export interface SuspenseContext {
    contextChain: ContextEntry[];
    scope: Scope;
    cacheMode: CacheMode;
    saveSnapshot<T>(currentValue: T, initialValue: T): void;
    getSnapshot<T>(): T;
}

export interface UseResourceOptions {
    scope: Scope;
    cacheMode: CacheMode;
}

const noop = () => undefined;

export const Context = createContext<SuspenseContext | null>(null);
Context.displayName = 'SuspenseBoundaryContext';

export const globalScope = {name: '#global'};

const isMock = <I, O>(actionOrMockValue: Fetch<I, O> | O): actionOrMockValue is O => {
    return typeof actionOrMockValue !== 'function';
};

const isInChain = (contextChain: ContextEntry[], options?: UseResourceOptions): boolean => {
    if (!options || options.scope === globalScope) {
        return true;
    }

    return contextChain.some(c => c.scope === options.scope && c.cacheMode === options.cacheMode);
};

/* eslint-disable react-hooks/rules-of-hooks */
export function useResource<I, O>(
    actionOrMockValue: Fetch<I, O> | O,
    params: I,
    options?: UseResourceOptions
): Resource<O> {
    const suspenseContext = useContext(Context);
    const forceUpdate = useForceUpdate();
    const keyString = stringifyKey(params);

    if (!suspenseContext) {
        throw new Error('You should not use useResource outside a <Boundary>');
    }

    if (!isInChain(suspenseContext.contextChain, options)) {
        throw new Error('Unable to find an ancestor with given scope and cache mode');
    }

    const scope = options?.scope ?? suspenseContext.scope;
    const cacheMode = options?.cacheMode ?? suspenseContext.cacheMode;
    const cache = findCache(scope, cacheMode);

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
}
/* eslint-enable react-hooks/rules-of-hooks */

export function useResourceWithMock<I, O>(
    actionOrMockValue: Fetch<I, O> | O,
    mockValue: O,
    params: I,
    options?: UseResourceOptions
): Resource<O> {
    try {
        return useResource(actionOrMockValue, params, options);
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
}

export function useGlobalResource<I, O>(
    actionOrMockValue: Fetch<I, O> | O,
    params: I,
    cacheMode: CacheMode
): Resource<O> {
    return useResource(actionOrMockValue, params, {cacheMode, scope: globalScope});
}

export function useGlobalResourceWithMock<I, O>(
    actionOrMockValue: Fetch<I, O> | O,
    mockValue: O,
    params: I,
    cacheMode: CacheMode
): Resource<O> {
    return useResourceWithMock(actionOrMockValue, mockValue, params, {cacheMode, scope: globalScope});
}

export function useSnapshot<T>(currentValue: T, initialValue: T): T {
    const suspenseContext = useContext(Context);
    invariant(suspenseContext, 'You should not use useSnapshot outside a <Boundary>');
    const {saveSnapshot, getSnapshot} = suspenseContext as SuspenseContext;
    saveSnapshot(currentValue, initialValue);
    return getSnapshot();
}
