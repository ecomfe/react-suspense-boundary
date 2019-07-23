import stringify from 'fast-json-stable-stringify';
import {omit} from './utils';

export default class Cache {
    cache = new WeakMap();

    cacheMode = null;

    constructor(cacheMode) {
        this.cacheMode = cacheMode;
    }

    put(action, key, query) {
        const {cache, cacheMode} = this;
        const keyString = stringify(key);

        if (cacheMode === 'function') {
            cache.set(action, {key, keyString, query});
        }
        else {
            const querySet = cache.get(action) || {};
            cache.set(action, {...querySet, [keyString]: query});
        }
    }

    find(action, key) {
        const {cache, cacheMode} = this;
        const container = cache.get(action) || {};
        const keyString = stringify(key);

        if (cacheMode === 'function') {
            return container.keyString === keyString ? container.query : undefined;
        }

        return container[keyString];
    }

    remove(action, key) {
        const {cache, cacheMode} = this;

        if (cacheMode === 'function') {
            cache.delete(action);
            return;
        }

        const querySet = cache.get(action);
        const keyString = stringify(key);

        if (!querySet || !querySet[keyString]) {
            return;
        }

        cache.set(action, omit(querySet, keyString));
    }
}
