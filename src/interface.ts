export type ConstantAsync<O> = () => Promise<O>;

export type Async<I, O> = (params: I) => Promise<O>;

export type LooseApi<O = unknown> = Async<any, O> | ConstantAsync<O>;

export interface Pending<O> {
    kind: 'pending';
    promise: Promise<O>;
}

export interface HasValue<O> {
    kind: 'hasValue';
    data: O;
    pending: boolean;
}

export interface HasError {
    kind: 'hasError';
    error: Error;
}

export type ResourceState<O> = Pending<O> | HasValue<O> | HasError;

export type Family<O> = Map<string, ResourceState<O>>;

export interface CacheController {
    <I, O>(api: Async<I, O>, params: I): void;
    <O>(api: ConstantAsync<O>): void;
}

export interface ResourceController {
    pending: boolean;
    expire: () => void;
    refresh: () => void;
}
