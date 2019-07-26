import {Component, Suspense, createElement} from 'react';
import PropTypes from 'prop-types';
import {Context} from './context';
import Cache from './Cache';
import {omit} from './utils';

const UNINITIALIZED = {};

export default class SuspenseBoundary extends Component {

    static propTypes = {
        is: PropTypes.elementType,
        cacheMode: PropTypes.oneOf(['function', 'key']),
        children: PropTypes.node.isRequired,
        pendingFallback: PropTypes.node,
        renderError: PropTypes.func,
    };

    static defaultProps = {
        is: 'div',
        cacheMode: 'key',
        pendingFallback: 'pending',
        renderError() {
            return 'error';
        },
    };

    state = {
        error: null,
        // 这东西虽然在`state`里面，但它是完全不触发更新的，处理的时候要小心。
        // 放在`state`里面完全是为了`getDerivedStateFromProps`可以正常工作
        pending: null,
        settled: null,
        cacheMode: null,
        forceUpdateIdentifier: 0,
    };

    snapshot = UNINITIALIZED;

    pending = null;

    previousIdentifier = null;

    contextValue = null;

    putSettled(action, key, query) {
        const updater = ({cacheMode, pending, settled, forceUpdateIdentifier}) => {
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

    computeContextValue = () => {
        const {forceUpdateIdentifier, cache} = this.state;

        if (forceUpdateIdentifier !== this.previousIdentifier) {
            this.previousIdentifier = forceUpdateIdentifier;
            this.contextValue = {
                cache,
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

    saveSnapshot = (currentValue, initialValue) => {
        if (this.snapshot === UNINITIALIZED) {
            this.snapshot = initialValue;
        }

        if (currentValue) {
            this.snapshot = currentValue;
        }
    };

    getSnapshot = () => {
        return this.snapshot;
    };

    find = (action, key) => {
        const {pending, settled} = this.state;
        return pending.find(action, key) || settled.find(action, key);
    };

    // 在一个请求开始的时候，直接放进`pending`池子里，但不要使用`setState`触发更新，
    // 因为`fetch`是在一个组件的`render`时被调用的，此时触发更新会与React期望的“渲染是纯函数”相悖。
    // 因为整个异步的逻辑控制由`Suspense`处理，这个`promise`本身就会被注册回调，所以这里不触发更新不会影响组件的正确运行
    fetch = (action, key, promise) => this.state.pending.put(action, key, {pending: promise});

    receive = (action, key, data) => this.putSettled(action, key, {data});

    error = (action, key, error) => this.putSettled(action, key, {error});

    expire = (action, key) => {
        const updater = ({pending, settled, forceUpdateIdentifier}) => {
            pending.remove(action, key);
            settled.remove(action, key);
            return {forceUpdateIdentifier: forceUpdateIdentifier + 1};
        };
        this.setState(updater);
    };

    static getDerivedStateFromProps(props, state) {
        const {cacheMode} = props;

        if (state.cacheMode !== cacheMode) {
            return {
                cacheMode: cacheMode,
                pending: new Cache(cacheMode),
                settled: new Cache(cacheMode),
            };
        }

        return null;
    }

    static getDerivedStateFromError(error) {
        return {error};
    }

    componentDidCatch() {
        // do nothing
    }

    render() {
        const {is, children, pendingFallback, renderError, ...props} = this.props;
        const {error} = this.state;
        const contextValue = this.computeContextValue(this.state);
        const content = (
            <Context.Provider value={contextValue}>
                <Suspense fallback={pendingFallback}>
                    {error ? renderError(error) : children}
                </Suspense>
            </Context.Provider>
        );

        return createElement(is, omit(props, 'cacheMode'), content);
    }
}
