import React, {Component, Suspense, ReactNode} from 'react';
import * as PropTypes from 'prop-types';
import {Context, SuspenseContext, Fetch, Query} from './context';
import SuspenseError from './SuspenseError';
import {enterCache, leaveCache, Scope} from './CacheManager';
import Cache, {CacheMode} from './Cache';

const UNINITIALIZED = {};

type OmitUndefined<T> = T extends undefined ? never : T;

export interface SuspenseBoundaryProps {
    cacheMode: CacheMode;
    pendingFallback: OmitUndefined<ReactNode>;
    scope?: Scope;
    renderError(error: Error, recover: () => void): ReactNode;
}

interface State {
    error: Error | null;
    scope: Scope;
    givenScope?: Scope;
    // 这东西虽然在`state`里面，但它是完全不触发更新的，处理的时候要小心。
    // 放在`state`里面完全是为了`getDerivedStateFromProps`可以正常工作
    pending: Cache;
    settled: Cache;
    cacheMode: CacheMode;
    forceUpdateIdentifier: number;
}

export default class SuspenseBoundary extends Component<SuspenseBoundaryProps, State> {

    static propTypes = {
        cacheMode: PropTypes.oneOf(['function', 'key']),
        children: PropTypes.node.isRequired,
        pendingFallback: PropTypes.node,
        scope: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        renderError: PropTypes.func,
    };

    static defaultProps = {
        cacheMode: 'key',
        pendingFallback: 'pending',
        scope: undefined,
        renderError() {
            return 'error';
        },
    };

    private snapshot: any;

    private previousIdentifier: number;

    private contextValue: SuspenseContext | null;

    constructor(props: SuspenseBoundaryProps) {
        super(props);
        const scope = props.scope || {};
        const {pending, settled} = enterCache(scope, props.cacheMode);
        this.state = {
            scope,
            pending,
            settled,
            givenScope: props.scope,
            error: null,
            cacheMode: props.cacheMode,
            forceUpdateIdentifier: 0,
        };
        this.snapshot = UNINITIALIZED;
        this.previousIdentifier = -1;
        this.contextValue = null;
    }

    static getDerivedStateFromProps(props: SuspenseBoundaryProps, state: State): Partial<State> | null {
        if (state.givenScope !== props.scope || state.cacheMode !== props.cacheMode) {
            leaveCache(state.scope, state.cacheMode);
            const scope = props.scope || {};
            const {pending, settled} = enterCache(scope, props.cacheMode);
            return {
                scope,
                pending,
                settled,
                givenScope: props.scope,
                cacheMode: props.cacheMode,
            };
        }

        return null;
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {error};
    }

    componentWillUnmount() {
        leaveCache(this.state.scope, this.state.cacheMode);
    }

    putSettled<I, O>(action: Fetch<I, O>, key: I, query: Query<O>): void {
        const updater = ({cacheMode, pending, settled, forceUpdateIdentifier}: State) => {
            // 如果以函数为粒度做缓存，会产生竞态，此时如果在写入结果时，运行中的那个`key`和写入的对不上，直接抛弃掉结果
            if (cacheMode === 'function' && !pending.find(action, key)) {
                return null;
            }

            pending.remove(action, key);
            settled.put(action, key, query);
            return {forceUpdateIdentifier: forceUpdateIdentifier + 1};
        };
        this.setState(updater);
    }

    renderError(error: Error) {
        const {renderError} = this.props;
        const recover = () => {
            if (error instanceof SuspenseError) {
                this.expire(error.action, error.key);
            }
            this.setState({error: null});
        };
        return renderError(error instanceof SuspenseError ? error.actualError : error, recover);

    }

    computeContextValue = (): SuspenseContext => {
        const {forceUpdateIdentifier} = this.state;

        if (!this.contextValue || forceUpdateIdentifier !== this.previousIdentifier) {
            this.previousIdentifier = forceUpdateIdentifier;
            this.contextValue = {
                find: this.find,
                fetch: this.fetch,
                receive: this.receive,
                error: this.error,
                expire: this.expire,
                saveSnapshot: this.saveSnapshot,
                getSnapshot: this.getSnapshot,
            };
        }

        return this.contextValue;
    };

    saveSnapshot: SuspenseContext['saveSnapshot'] = (currentValue, initialValue) => {
        if (this.snapshot === UNINITIALIZED) {
            this.snapshot = initialValue;
        }

        if (currentValue) {
            this.snapshot = currentValue;
        }
    };

    getSnapshot: SuspenseContext['getSnapshot'] = () => {
        return this.snapshot;
    };

    find: SuspenseContext['find'] = (action, key) => {
        const {pending, settled} = this.state;
        return pending.find(action, key) || settled.find(action, key);
    };

    // 在一个请求开始的时候，直接放进`pending`池子里，但不要使用`setState`触发更新，
    // 因为`fetch`是在一个组件的`render`时被调用的，此时触发更新会与React期望的“渲染是纯函数”相悖。
    // 因为整个异步的逻辑控制由`Suspense`处理，这个`promise`本身就会被注册回调，所以这里不触发更新不会影响组件的正确运行
    fetch: SuspenseContext['fetch'] = (action, key, promise) => this.state.pending.put(action, key, {pending: promise});

    receive: SuspenseContext['receive'] = (action, key, data) => this.putSettled(action, key, {data});

    error: SuspenseContext['error'] = (action, key, error) => this.putSettled(action, key, {error});

    expire: SuspenseContext['expire'] = (action, key) => {
        const updater = ({pending, settled, forceUpdateIdentifier}: State) => {
            pending.remove(action, key);
            settled.remove(action, key);
            return {forceUpdateIdentifier: forceUpdateIdentifier + 1};
        };
        this.setState(updater);
    };

    componentDidCatch() {
        // do nothing
    }

    render() {
        const {children, pendingFallback} = this.props;
        const {error} = this.state;
        const contextValue = this.computeContextValue();
        return (
            <Context.Provider value={contextValue}>
                <Suspense fallback={pendingFallback}>
                    {error ? this.renderError(error) : children}
                </Suspense>
            </Context.Provider>
        );
    }
}
