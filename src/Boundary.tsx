import React, {useMemo, Suspense, ReactNode, FC, useRef, useEffect, useContext, ErrorInfo} from 'react';
import * as PropTypes from 'prop-types';
import {Context, SuspenseContext} from './context';
import {enterCache, leaveCache, findCache, Scope} from './CacheManager';
import {CacheMode} from './Cache';
import ErrorBoundary from './ErrorBoundary';
import {useConfigWithOverrides} from './ConfigProvider';

const UNINITIALIZED = {};

type OmitUndefined<T> = T extends undefined ? never : T;

export interface SuspenseBoundaryProps {
    cacheMode?: CacheMode;
    pendingFallback?: OmitUndefined<ReactNode>;
    scope?: Scope;
    children: ReactNode;
    renderError?(error: Error, recover: () => void): ReactNode;
    onErrorCaught?(error: Error, info: ErrorInfo): void;
}

const SuspenseBoundary: FC<SuspenseBoundaryProps> = props => {
    const {cacheMode = 'key', scope, children} = props;
    const {pendingFallback, renderError, onErrorCaught} = useConfigWithOverrides(props);
    const scopeToUse = useMemo(
        () => scope ?? {name: '#auto'},
        [scope]
    );
    const cache = useMemo(
        () => findCache(scopeToUse, cacheMode),
        [cacheMode, scopeToUse]
    );
    const snapshot = useRef<any>(UNINITIALIZED);
    const outerContext = useContext(Context);
    const previousChain = outerContext?.contextChain;
    const contextChain = useMemo(
        () => {
            const currentContextEntry = {cacheMode, scope: scopeToUse};
            // In most cases we use the nearest boundary scope, so this should be prepended for a faster iteration
            return previousChain ? [currentContextEntry, ...previousChain] : [currentContextEntry];
        },
        [cacheMode, scopeToUse, previousChain]
    );
    const contextValue: SuspenseContext = useMemo(
        () => {
            return {
                contextChain,
                cacheMode,
                scope: scopeToUse,
                saveSnapshot<T>(currentValue: T, initialValue: T) {
                    if (snapshot.current === UNINITIALIZED) {
                        snapshot.current = initialValue;
                    }

                    if (currentValue) {
                        snapshot.current = currentValue;
                    }
                },
                getSnapshot() {
                    return snapshot.current === UNINITIALIZED ? undefined : snapshot.current;
                },
            };
        },
        [cacheMode, contextChain, scopeToUse]
    );
    useEffect(
        () => {
            enterCache(scopeToUse, cacheMode);
            return () => leaveCache(scopeToUse, cacheMode);
        },
        [cacheMode, scopeToUse]
    );

    return (
        <ErrorBoundary cache={cache} renderError={renderError} onErrorCaught={onErrorCaught}>
            <Context.Provider value={contextValue}>
                <Suspense fallback={pendingFallback}>
                    {children}
                </Suspense>
            </Context.Provider>
        </ErrorBoundary>
    );
};

/* eslint-disable react/require-default-props */
SuspenseBoundary.propTypes = {
    cacheMode: PropTypes.oneOf(['function', 'key']),
    children: PropTypes.node.isRequired,
    pendingFallback: PropTypes.node,
    scope: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    renderError: PropTypes.func,
    onErrorCaught: PropTypes.func,
};

export default SuspenseBoundary;
