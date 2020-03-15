import Cache, {CacheMode} from './Cache';

export type Scope = string | {name?: string};

interface ScopeCache {
    pending: Cache;
    settled: Cache;
}

interface ReferenceCounter<T> {
    referenceCount: number;
    value: T;
}

const scopes = new Map<Scope, Map<CacheMode, ReferenceCounter<ScopeCache>>>();

const getOrCreate = <K, V>(map: Map<K, V>, key: K, initialize: () => V) => {
    if (!map.has(key)) {
        map.set(key, initialize());
    }
    return map.get(key) as V;
};

const newScopeCache = (cacheMode: CacheMode): ReferenceCounter<ScopeCache> => {
    return {
        referenceCount: 0,
        value: {
            pending: new Cache(cacheMode),
            settled: new Cache(cacheMode),
        },
    };
};

export const enterCache = (scope: Scope, cacheMode: CacheMode): ScopeCache => {
    const inScope = getOrCreate(scopes, scope, () => new Map<CacheMode, ReferenceCounter<ScopeCache>>());
    const inMode = getOrCreate(inScope, cacheMode, () => newScopeCache(cacheMode));
    inMode.referenceCount++;
    return inMode.value;
};

export const leaveCache = (scope: Scope, cacheMode: CacheMode): void => {
    const inScope = scopes.get(scope);

    if (!inScope) {
        return;
    }

    const inMode = inScope.get(cacheMode);

    if (!inMode) {
        return;
    }

    inMode.referenceCount--;

    if (!inMode.referenceCount) {
        inScope.delete(cacheMode);
    }

    if (!scopes.size) {
        scopes.delete(scope);
    }
};
