import {createSuspenseBoundary, SuspenseBoundaryProps} from './boundary.js';
import {createCacheProvider} from './cache.js';
import {createConfigProvider} from './config.js';

interface CreateOptions {
    cacheContextDisplayName?: string;
    configContextDisplayName?: string;
}

export const create = ({cacheContextDisplayName, configContextDisplayName}: CreateOptions = {}) => {
    const {
        BoundaryConfigProvider,
        useBoundaryConfig,
    } = createConfigProvider({contextDisplayName: configContextDisplayName});
    const {
        CacheProvider,
        useConstantResource,
        useExpireCache,
        usePreloadConstantResource,
        usePreloadResource,
        usePreloadResourceCallback,
        useRefreshCache,
        useResource,
    } = createCacheProvider({contextDisplayName: cacheContextDisplayName});
    const {Boundary, withBoundary} = createSuspenseBoundary({useBoundaryConfig, useExpireCache});

    return {
        BoundaryConfigProvider,
        CacheProvider,
        Boundary,
        useBoundaryConfig,
        useConstantResource,
        usePreloadConstantResource,
        usePreloadResource,
        usePreloadResourceCallback,
        useRefreshCache,
        useResource,
        withBoundary,
    };
};

const {
    BoundaryConfigProvider,
    CacheProvider,
    Boundary,
    useBoundaryConfig,
    useConstantResource,
    usePreloadConstantResource,
    usePreloadResource,
    usePreloadResourceCallback,
    useRefreshCache,
    useResource,
    withBoundary,
} = create();

export {
    BoundaryConfigProvider,
    CacheProvider,
    Boundary,
    useBoundaryConfig,
    useConstantResource,
    usePreloadConstantResource,
    usePreloadResource,
    usePreloadResourceCallback,
    useRefreshCache,
    useResource,
    withBoundary,
};

export {default as ErrorBoundary} from './ErrorBoundary.js';
export type {SuspenseBoundaryProps};
export type {RenderErrorOptions} from './ErrorBoundary.js';
export type {CacheController, ResourceController} from './interface.js';
