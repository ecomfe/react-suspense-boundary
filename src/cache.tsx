import {useRef, useMemo, useCallback, useContext, createContext, ReactNode, useLayoutEffect} from 'react';
import {useSyncExternalStore} from 'use-sync-external-store/shim';
import {
    Async,
    ResourceController,
    CacheController,
    AwaitableCacheController,
    LooseApi,
    ConstantAsync,
    ResourceState,
} from './interface.js';
import {ObservableCache} from './ObservableCache.js';
import SuspenseError from './SuspenseError.js';
import {stringifyKey} from './utils.js';

interface FetchToCacheOptions {
    computedKey?: string;
    workingType: 'init' | 'set' | 'refresh' | 'none';
}

const getWorkInProgress = (state: ResourceState<unknown> | undefined): Promise<unknown> | null => {
    switch (state?.kind) {
        case 'pending':
        case 'hasValuePending':
            return state.promise;
        default:
            return null;
    }
};

const fetchToCache = (cache: ObservableCache, api: LooseApi, params: unknown, options: FetchToCacheOptions) => {
    const {computedKey, workingType} = options;
    const key = computedKey ?? stringifyKey(params);
    const current = cache.get(api, key);
    const workingInProgress = getWorkInProgress(current);

    if (workingInProgress) {
        return workingInProgress;
    }

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
        case 'refresh': {
            if (current && (current.kind === 'hasValue' || current.kind === 'hasValuePending')) {
                cache.set(api, key, {promise, data: current.data, kind: 'hasValuePending'});
            }
        }
    }

    return promise;
};

export interface ContextValue {
    cache: ObservableCache;
    promiseResolver: () => void;
    promisePendingComponentMount: Promise<void>;
}

const promiseWithResolvers = () => {
    let resolve = () => {};
    let reject = () => {};
    const promise = new Promise<void>((resolver, rejector) => {
        resolve = resolver;
        reject = rejector;
    });
    return {promise, resolve, reject} as const;
};

const createCacheContextValue = () => {
    const cache = new ObservableCache(new WeakMap());
    const {promise, resolve} = promiseWithResolvers();
    return {cache, promiseResolver: resolve, promisePendingComponentMount: promise};
};

export interface Props {
    children: ReactNode;
}

interface Options {
    contextDisplayName?: string;
}

export const createCacheProvider = ({contextDisplayName = 'BoundaryCacheContext'}: Options) => {
    const Context = createContext<ContextValue>(createCacheContextValue());
    Context.displayName = contextDisplayName;

    function CacheProvider({children}: Props) {
        const ref = useRef(createCacheContextValue());
        // 如果请求被响应的太快 就会在 CacheProvider 这个组件被 mount 之前就将 promise 解决，
        // 在并发模式下就会打断当前的渲染任务，触发一个新的渲染任务，导致重新生成 FiberTree，
        // 也就是本轮生成的 FiberTree（Tree—1）还没有替换旧的 FiberTree（Tree—0），
        // 所以新的 FiberTree（Tree—2），还是根据旧的 FiberTree（Tree—0） 生成的，
        // 所以生成 Tree—2 的时候会重新 mount CacheProvider 这个组件，Context 也会被重置
        // 最终造成重复渲染。useLayoutEffect 会在 commit 阶段执行。
        // 这时候 CacheProvider 这个组件就已经被 mount 了，即使触发 Suspense 导致的重新渲染，也能获得稳定的引用。
        useLayoutEffect(
            () => {
                ref.current.promiseResolver();
            },
            []
        );

        return <Context.Provider value={ref.current}>{children}</Context.Provider>;
    }

    function useExpireCache(): CacheController {
        const {cache} = useContext(Context);
        const expire = useCallback(
            (api: LooseApi, params: unknown) => {
                fetchToCache(cache, api, params, {workingType: 'set'});
            },
            [cache]
        );
        return expire as CacheController;
    }

    function useRefreshCache(): AwaitableCacheController {
        const {cache} = useContext(Context);
        const refresh = useCallback(
            async (api: LooseApi, params: unknown) => {
                await fetchToCache(cache, api, params, {workingType: 'refresh'});
            },
            [cache]
        );
        return refresh as AwaitableCacheController;
    }

    function useResourceInternal<O>(api: LooseApi<O>, params?: unknown): [O, ResourceController] {
        const {cache, promisePendingComponentMount} = useContext(Context);
        const key = useMemo(
            () => stringifyKey(params),
            [params]
        );
        const state = useSyncExternalStore(
            callback => cache.observe(api, key, callback),
            () => cache.get(api, key)
        );
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
            throw Promise.all([promise, promisePendingComponentMount]);
        }

        switch (state.kind) {
            case 'pending':
                throw state.promise;
            case 'hasValue':
                return [state.data as O, {expire, refresh, pending: false}];
            case 'hasValuePending':
                return [state.data as O, {expire, refresh, pending: true}];
            case 'hasError':
                throw new SuspenseError(api, params, state.error);
            default:
                throw new Error(`Unexpected state ${(state as any).kind} in resource.`);
        }
    }

    function useResource<I, O>(api: Async<I, O>, params: I) {
        return useResourceInternal(api, params);
    }

    function useConstantResource<O>(api: ConstantAsync<O>) {
        return useResourceInternal(api);
    }

    function useResourceController<I, O>(api: Async<I, O>, params: I) {
        return useResourceInternal(api, params)[1];
    }

    function useConstantResourceController<O>(api: ConstantAsync<O>) {
        return useResourceInternal(api)[1];
    }

    function usePreloadResource<I, O>(api: Async<I, O>, params: I): void {
        const {cache} = useContext(Context);
        const key = stringifyKey(params);

        if (!cache.has(api, key)) {
            fetchToCache(cache, api, params, {computedKey: key, workingType: 'init'});
        }
    }

    function usePreloadConstantResource<O>(api: ConstantAsync<O>): void {
        const {cache} = useContext(Context);
        const key = stringifyKey(undefined);

        if (!cache.has(api, key)) {
            fetchToCache(cache, api, undefined, {computedKey: key, workingType: 'init'});
        }
    }

    function usePreloadResourceCallback(): CacheController {
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

    return {
        CacheProvider,
        useExpireCache,
        useRefreshCache,
        useResource,
        useConstantResource,
        useResourceController,
        useConstantResourceController,
        usePreloadResource,
        usePreloadConstantResource,
        usePreloadResourceCallback,
    };
};
