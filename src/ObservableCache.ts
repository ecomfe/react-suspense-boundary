import {ResourceState, LooseApi, Family} from './interface.js';

interface Listener {
    api: LooseApi;
    key: string;
    callback: () => void;
}

export class ObservableCache {
    private readonly listeners: Set<Listener> = new Set();

    private version: number = 0;

    constructor(private readonly cache: WeakMap<LooseApi, Family<unknown>>) {}

    getVersion() {
        return this.version;
    }

    init(api: LooseApi, key: string, promise: Promise<unknown>): void {
        const family = this.getFamilySafe(api)!;
        family.set(key, {promise, kind: 'pending'});
    }

    set(api: LooseApi, key: string, value: ResourceState<unknown>): void {
        const family = this.getFamilySafe(api)!;
        family.set(key, value);
        this.version++;
        this.notify(api, key);
    }

    get(api: LooseApi, key: string): ResourceState<unknown> | undefined {
        return this.getFamilySafe(api).get(key);
    }

    has(api: LooseApi, key: string): boolean {
        return this.cache.has(api) && this.cache.get(api)!.has(key);
    }

    observe(api: LooseApi, key: string, callback: () => void): () => void {
        const listener: Listener = {api, key, callback};
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private getFamilySafe(api: LooseApi): Family<unknown> {
        if (!this.cache.has(api)) {
            this.cache.set(api, new Map());
        }

        return this.cache.get(api)!;
    }

    private notify(api: LooseApi, key: string): void {
        for (const listener of this.listeners) {
            if (listener.api === api && listener.key === key) {
                listener.callback();
            }
        }
    }
}
