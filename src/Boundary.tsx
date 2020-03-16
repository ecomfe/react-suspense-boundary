import React, {useMemo, Suspense, ReactNode, FC, useRef, useEffect} from 'react';
import * as PropTypes from 'prop-types';
import {Context, SuspenseContext} from './context';
import {enterCache, leaveCache, findCache, Scope} from './CacheManager';
import {CacheMode} from './Cache';
import ErrorBoundary from './ErrorBoundary';

const UNINITIALIZED = {};

type OmitUndefined<T> = T extends undefined ? never : T;

export interface SuspenseBoundaryProps {
    cacheMode?: CacheMode;
    pendingFallback?: OmitUndefined<ReactNode>;
    scope?: Scope;
    children: ReactNode;
    renderError?(error: Error, recover: () => void): ReactNode;
}

const SuspenseBoundary: FC<SuspenseBoundaryProps> = props => {
    const {cacheMode = 'key', pendingFallback = 'pending', scope, renderError = () => 'error', children} = props;
    const scopeToUse = useMemo(
        () => scope ?? {name: '#Auto'},
        [scope]
    );
    const cache = useMemo(
        () => findCache(scopeToUse, cacheMode),
        [cacheMode, scopeToUse]
    );
    const snapshot = useRef<any>(UNINITIALIZED);
    const contextValue: SuspenseContext = useMemo(
        () => {
            return {
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
        [cacheMode, scopeToUse]
    );
    useEffect(
        () => {
            enterCache(scopeToUse, cacheMode);
            return () => leaveCache(scopeToUse, cacheMode);
        },
        [cacheMode, scopeToUse]
    );

    return (
        <ErrorBoundary cache={cache} renderError={renderError}>
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
};

export default SuspenseBoundary;
