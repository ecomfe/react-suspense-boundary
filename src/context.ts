import {createContext, useContext, useCallback, useEffect} from 'react';
import invariant from 'tiny-invariant';
import {useForceUpdate} from '@huse/update';
import SuspenseError from './SuspenseError';
import {CacheMode} from './Cache';
import {Scope, findCache} from './CacheManager';
import {stringifyKey} from './utils';

export type Fetch<I, O> = (args: I) => Promise<O>;

export interface ResourceController {
    refresh(): Promise<void>;
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
const noopAsync = () => Promise.resolve();

export const Context = createContext<SuspenseContext | null>(null);
Context.displayName = 'SuspenseBoundaryContext';

export const globalScope = {name: '#global'};

export const isMock = <I, O>(actionOrMockValue: Fetch<I, O> | O): actionOrMockValue is O => {
    return typeof actionOrMockValue !== 'function';
};

export const isInChain = (contextChain: ContextEntry[], options?: UseResourceOptions): boolean => {
    if (!options || options.scope === globalScope) {
        return true;
    }

    return contextChain.some(c => c.scope === options.scope && c.cacheMode === options.cacheMode);
};

export const useSuspenseContext = (options?: UseResourceOptions) => {
    const suspenseContext = useContext(Context);

    if (!suspenseContext) {
        throw new Error('You should not use useResource outside a <Boundary>');
    }

    if (!isInChain(suspenseContext.contextChain, options)) {
        throw new Error('Unable to find an ancestor with given scope and cache mode');
    }

    return suspenseContext;
};

export interface ManualResourceController {
    refresh(fetch: any): Promise<void>;
    expire(fetch: any): void;
}

export type ResourceInput<I, O> = [Fetch<I, O> | O, I];

export function useResourceAll<I1, O1>(
    inputs: [ResourceInput<I1, O1>],
    options?: UseResourceOptions
): [[O1], ManualResourceController];
export function useResourceAll<I1, O1, I2, O2>(
    inputs: [ResourceInput<I1, O1>, ResourceInput<I2, O2>],
    options?: UseResourceOptions
): [[O1, O2], ManualResourceController];
export function useResourceAll<I1, O1, I2, O2, I3, O3>(
    inputs: [ResourceInput<I1, O1>, ResourceInput<I2, O2>, ResourceInput<I3, O3>],
    options?: UseResourceOptions
): [[O1, O2, O3], ManualResourceController];
export function useResourceAll<I1, O1, I2, O2, I3, O3, I4, O4>(
    inputs: [ResourceInput<I1, O1>, ResourceInput<I2, O2>, ResourceInput<I3, O3>, ResourceInput<I4, O4>],
    options?: UseResourceOptions
): [[O1, O2, O3, O4], ManualResourceController];
export function useResourceAll(
    inputs: Array<ResourceInput<any, any>>,
    options?: UseResourceOptions
): [any[], ManualResourceController] {
    const suspenseContext = useSuspenseContext();
    const forceUpdate = useForceUpdate();
    const scope = options?.scope ?? suspenseContext.scope;
    const cacheMode = options?.cacheMode ?? suspenseContext.cacheMode;
    const cache = findCache(scope, cacheMode);

    useEffect(
        () => {
            const subscribe = ([actionOrMockValue, key]) => {
                const keyString = stringifyKey(key);
                const update = (action: any, key: any) => {
                    if (action === actionOrMockValue && stringifyKey(key) === keyString) {
                        forceUpdate();
                    }
                };
                const unsubscribe = cache.subscribe(update);
                return unsubscribe;
            };
            const subscriptions = inputs.map(subscribe);
            return () => subscriptions.forEach(s => s());
        },
        [inputs, cache, forceUpdate]
    );
    const refresh = useCallback(
        (action: any) => {
            const targetInput = inputs.find(([fetch]) => fetch === action);

            if (targetInput) {
                const [action, params] = targetInput;
                const pending = action(params).then(
                    (value: any) => cache.receive(action, params, value),
                    (reason: any) => cache.error(action, params, reason)
                );
                cache.fetch(action, params, pending);
                return pending;
            }
        },
        [cache, inputs]
    );
    const expire = useCallback(
        (action: any) => {
            const targetInput = inputs.find(([fetch]) => fetch === action);

            if (targetInput) {
                const [action, params] = targetInput;
                cache.expire(action, params);
            }
        },
        [cache, inputs]
    );

    const waits: Array<Promise<any>> = [];
    const values: any[] = [];
    for (const [action, params] of inputs) {
        if (isMock(action)) {
            values.push(action);
            break;
        }

        const query = cache.find(action, params);
        if (!query) {
            waits.push(refresh(action));
        }
        else if (query.data !== undefined) {
            values.push(query.data);
        }
        else if (query.pending) {
            waits.push(query.pending);
        }
        else if (query.error) {
            throw new SuspenseError(action, params, query.error);
        }
        else {
            throw new Error('Unexpected suspense state without data, pending and error');
        }
    }

    if (waits.length) {
        throw Promise.all(waits);
    }

    return [values, {refresh, expire}];
}

/* eslint-disable react-hooks/rules-of-hooks */
export function useResource<I, O>(
    actionOrMockValue: Fetch<I, O> | O,
    params: I,
    options?: UseResourceOptions
): Resource<O> {
    const [[value], {refresh, expire}] = useResourceAll([[actionOrMockValue, params]], options);
    const boundRefresh = useCallback(
        () => refresh(actionOrMockValue),
        [actionOrMockValue, refresh]
    );
    const boundExpire = useCallback(
        () => expire(actionOrMockValue),
        [actionOrMockValue, expire]
    );
    return [
        value,
        {
            refresh: boundRefresh,
            expire: boundExpire,
        },
    ];
}

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
                    refresh: noopAsync,
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
