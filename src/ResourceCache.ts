import Subscription from './Subscription';
import Cache, {CacheMode} from './Cache';
import {Query, Fetch} from './context';

export default class ResourceCache {
    private readonly subscription = new Subscription();

    private readonly pending: Cache;

    private readonly settled: Cache;

    private readonly cacheMode: CacheMode;

    constructor(cacheMode: CacheMode) {
        this.pending = new Cache(cacheMode);
        this.settled = new Cache(cacheMode);
        this.cacheMode = cacheMode;
    }

    subscribe(listener: (action: any, key: any) => void): () => void {
        return this.subscription.subscribe(listener);
    }

    find<I, O>(action: Fetch<I, O>, key: I): Query<O> | undefined {
        // In order to make `refresh` without pending indicator, find query in settled cache first.
        return this.settled.find(action, key) || this.pending.find(action, key);
    }

    fetch<I, O>(action: Fetch<I, O>, key: I, pending: Promise<void>): void {
        this.pending.put(action, key, {pending});
        // Do not notify subscription when put a fetching promise
    }

    receive<I, O>(action: Fetch<I, O>, key: I, data: O): void {
        this.putSettled(action, key, {data});
    }

    error<I, O>(action: Fetch<I, O>, key: I, error: Error): void {
        this.putSettled(action, key, {error});
    }

    expire<I, O>(action: Fetch<I, O>, key: I): void {
        this.pending.remove(action, key);
        this.settled.remove(action, key);
        this.subscription.notify(action, key);
    }

    private putSettled<I, O>(action: Fetch<I, O>, key: I, query: Query<O>): void {
        // 如果以函数为粒度做缓存，会产生竞态，此时如果在写入结果时，运行中的那个`key`和写入的对不上，直接抛弃掉结果
        if (this.cacheMode === 'function' && !this.pending.find(action, key)) {
            return;
        }

        this.pending.remove(action, key);
        this.settled.put(action, key, query);
        this.subscription.notify(action, key);
    }
}
