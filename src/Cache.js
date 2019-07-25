import stringifyJSON from 'fast-json-stable-stringify';
import {omit} from './utils';

const stringifyKey = key => {
    if (key === undefined) {
        return 'undefined';
    }

    return stringifyJSON(key);
};

export default class Cache {
    cache = new WeakMap();

    cacheMode = null;

    constructor(cacheMode) {
        this.cacheMode = cacheMode;
    }

    put(action, key, query) {
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

    find(action, key) {
        const {cache, cacheMode} = this;
        const container = cache.get(action) || {};
        const keyString = stringifyKey(key);

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
        const keyString = stringifyKey(key);

        if (!querySet || !querySet[keyString]) {
            return;
        }

        cache.set(action, omit(querySet, keyString));
    }
}
