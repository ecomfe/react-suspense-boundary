import {useRef, useMemo, useCallback, useContext, createContext, ReactNode} from 'react';
import {useSubscription} from 'use-subscription';
import {Async, ResourceController, CacheController, LooseApi, ConstantAsync} from './interface';
import {ObservableCache} from './ObservableCache';
import SuspenseError from './SuspenseError';
import {stringifyKey} from './utils';

interface ContextValue {
    cache: ObservableCache;
}

const createCacheContextValue = () => {
    const cache = new ObservableCache(new WeakMap());
    return {cache};
};

const Context = createContext<ContextValue>(createCacheContextValue());
Context.displayName = 'BoundaryCacheContext';

interface Props {
    children: ReactNode;
}

export default function CacheProvider({children}: Props) {
    const ref = useRef(createCacheContextValue());

    return <Context.Provider value={ref.current}>{children}</Context.Provider>;
}

interface FetchToCacheOptions {
    computedKey?: string;
    workingType: 'init' | 'set' | 'none';
}

const fetchToCache = (cache: ObservableCache, api: LooseApi, params?: unknown, options?: FetchToCacheOptions) => {
    const {computedKey, workingType} = options ?? {workingType: 'none'};
    const key = computedKey ?? stringifyKey(params);
    const promise = api(params).then(
        (data: any) => cache.set(api, key, {data, kind: 'hasValue'}),
        (error: any) => cache.set(api, key, {error, kind: 'hasError'})
    );
    switch (workingType) {
        case 'init':
            cache.init(api, key, promise);
            break;
        case 'set':
            cache.set(api, key, {promise, kind: 'pending'});
            break;
    }
    return promise;
};

export function useExpireCache(): CacheController {
    const {cache} = useContext(Context);
    const expire = useCallback(
        (api: LooseApi, params: unknown) => {
            fetchToCache(cache, api, params, {workingType: 'set'});
        },
        [cache]
    );
    return expire as CacheController;
}

export function useRefreshCache(): CacheController {
    const {cache} = useContext(Context);
    const refresh = useCallback(
        (api: LooseApi, params: unknown) => {
            fetchToCache(cache, api, params);
        },
        [cache]
    );
    return refresh as CacheController;
}

function useResourceInternal<O>(api: LooseApi<O>, params?: unknown): [O, ResourceController] {
    const {cache} = useContext(Context);
    const key = useMemo(
        () => stringifyKey(params),
        [params]
    );
    const subscription = useMemo(
        () => {
            return {
                getCurrentValue: () => cache.get(api, key),
                subscribe: (callback: () => void) => cache.observe(api, key, callback),
            };
        },
        [api, cache, key]
    );
    const state = useSubscription(subscription);
    const expireCache = useExpireCache();
    const refreshCache = useRefreshCache();
    const expire = useCallback(
        () => expireCache(api, params),
        [api, expireCache, params]
    );
    const refresh = useCallback(
        () => refreshCache(api, params),
        [api, refreshCache, params]
    );

    if (!state) {
        // 在`render`里修改`MutableSource`时，不能触发外部的监听，不然会导致类似这样的异常：
        //
        // > Cannot read from mutable source during the current render without tearing
        //
        // 所以这里调用`init`来跳过对外部的通知，因为`render`本身是个同步、线性的过程，
        // 所以能保证这里更新后，其它组件同一个周期内的`render`也能读取到，不会造成重复的请求
        const promise = fetchToCache(cache, api, params, {computedKey: key, workingType: 'init'});
        throw promise;
    }

    switch (state.kind) {
        case 'pending':
            throw state.promise;
        case 'hasValue':
            return [state.data as O, {expire, refresh}];
        case 'hasError':
            throw new SuspenseError(api, params, state.error);
        default:
            throw new Error(`Unexpected state ${(state as any).kind} in resource.`);
    }
}

export function useResource<I, O>(api: Async<I, O>, params: I) {
    return useResourceInternal(api, params);
}

export function useConstantResource<O>(api: ConstantAsync<O>) {
    return useResourceInternal(api);
}

export function usePreloadResource<I, O>(api: Async<I, O>, params: O) {
    const {cache} = useContext(Context);
    const key = stringifyKey(params);

    if (!cache.has(api, key)) {
        fetchToCache(cache, api, params, {computedKey: key, workingType: 'init'});
    }
}

export function usePreloadConstantResource<O>(api: ConstantAsync<O>) {
    const {cache} = useContext(Context);
    const key = stringifyKey(undefined);

    if (!cache.has(api, key)) {
        const promise = fetchToCache(cache, api, undefined, {computedKey: key, workingType: 'init'});
        cache.init(api, key, promise);
    }
}

export function usePreloadResourceCallback(): CacheController {
    const {cache} = useContext(Context);
    const preload = useCallback(
        (api: LooseApi, params?: unknown) => {
            const key = stringifyKey(params);
            if (!cache.has(api, key)) {
                fetchToCache(cache, api, params, {computedKey: key, workingType: 'init'});
            }
        },
        [cache]
    );
    return preload;
}
