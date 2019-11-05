import stringifyJSON from 'fast-json-stable-stringify';
import {omit} from './utils';
import {Query, Fetch} from './context';

export type CacheMode = 'function' | 'key';

const stringifyKey = (key: any): string => {
    if (key === undefined) {
        return 'undefined';
    }

    return stringifyJSON(key);
};

export default class Cache {
    cache = new WeakMap();

    cacheMode: CacheMode;

    constructor(cacheMode: CacheMode) {
        this.cacheMode = cacheMode;
    }

    put<I, O>(action: Fetch<I, O>, key: I, query: Query<O>): void {
        const {cache, cacheMode} = this;
        const keyString = stringifyKey(key);

        if (cacheMode === 'function') {
            cache.set(action, {key, keyString, query});
        }
        else {
            const querySet = cache.get(action) || {};
            cache.set(action, {...querySet, [keyString]: query});
        }
    }

    find<I, O>(action: Fetch<I, O>, key: I): Query<O> {
        const {cache, cacheMode} = this;
        const container = cache.get(action) || {};
        const keyString = stringifyKey(key);

        if (cacheMode === 'function') {
            return container.keyString === keyString ? container.query : undefined;
        }

        return container[keyString];
    }

    remove<I, O>(action: Fetch<I, O>, key: I): void {
        const {cache, cacheMode} = this;

        if (cacheMode === 'function') {
            cache.delete(action);
            return;
        }

        const querySet = cache.get(action);
        const keyString = stringifyKey(key);

        if (!querySet || !querySet[keyString]) {
            return;
        }

        cache.set(action, omit(querySet, keyString));
    }
}
