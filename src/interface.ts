export type ConstantAsync<O> = () => Promise<O>;

export type Async<I, O> = (params: I) => Promise<O>;

export type LooseApi<O = unknown> = Async<any, O> | ConstantAsync<O>;

export interface Pending<O> {
    kind: 'pending';
    promise: Promise<O>;
}

export interface HasValuePending<O> {
    kind: 'hasValuePending';
    data: O;
    promise: Promise<O>;
}

export interface HasValue<O> {
    kind: 'hasValue';
    data: O;
}

export interface HasError {
    kind: 'hasError';
    error: Error;
}

export type ResourceState<O> = Pending<O> | HasValuePending<O> | HasValue<O> | HasError;

export type Family<O> = Map<string, ResourceState<O>>;

export interface CacheController {
    <I, O>(api: Async<I, O>, params: I): void;
    <O>(api: ConstantAsync<O>): void;
}

export interface AwaitableCacheController {
    <I, O>(api: Async<I, O>, params: I): Promise<void>;
    <O>(api: ConstantAsync<O>): Promise<void>;
}

export interface ResourceController {
    pending: boolean;
    expire: () => void;
    refresh: () => Promise<void>;
}
