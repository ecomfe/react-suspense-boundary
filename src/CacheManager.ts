import {CacheMode} from './Cache';
import ResourceCache from './ResourceCache';

export type Scope = string | {name?: string, displayName?: string};

interface ReferenceCounter<T> {
    referenceCount: number;
    value: T;
}

const scopes = new Map<Scope, Map<CacheMode, ReferenceCounter<ResourceCache>>>();

const getOrCreate = <K, V>(map: Map<K, V>, key: K, initialize: () => V) => {
    if (!map.has(key)) {
        map.set(key, initialize());
    }
    return map.get(key) as V;
};

const newScopeCache = (cacheMode: CacheMode): ReferenceCounter<ResourceCache> => {
    return {
        referenceCount: 0,
        value: new ResourceCache(cacheMode),
    };
};

const stringifyScope = (scope: Scope): string => {
    if (typeof scope === 'string') {
        return scope;
    }

    return (scope.displayName ?? scope.name ?? 'unknown');
};

export const enterCache = (scope: Scope, cacheMode: CacheMode): void => {
    const reference = scopes.get(scope)?.get(cacheMode);

    if (!reference) {
        throw new Error(`Cache is not initialized for ${stringifyScope(scope)}/${cacheMode}`);
    }

    reference.referenceCount++;
};

export const leaveCache = (scope: Scope, cacheMode: CacheMode): void => {
    const inScope = scopes.get(scope);

    if (!inScope) {
        return;
    }

    const reference = inScope.get(cacheMode);

    if (!reference) {
        return;
    }

    reference.referenceCount--;

    if (!reference.referenceCount) {
        inScope.delete(cacheMode);
    }

    if (!inScope.size) {
        scopes.delete(scope);
    }
};

export const findCache = (scope: Scope, cacheMode: CacheMode): ResourceCache => {
    const inScope = getOrCreate(scopes, scope, () => new Map<CacheMode, ReferenceCounter<ResourceCache>>());
    const reference = getOrCreate(inScope, cacheMode, () => newScopeCache(cacheMode));
    return reference.value;
};
