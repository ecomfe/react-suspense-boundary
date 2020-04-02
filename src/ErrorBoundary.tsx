import React, {Component, ReactNode, ErrorInfo} from 'react';
import {Scope} from './CacheManager';
import SuspenseError from './SuspenseError';
import ResourceCache from './ResourceCache';

interface ErrorBoundaryProps {
    scope?: Scope;
    cache: ResourceCache;
    renderError(error: Error, recover: () => void): ReactNode;
    componentDidCatch?(error: Error, info: ErrorInfo, scope?: Scope): void;
}

interface State {
    error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, State> {

    readonly state: State = {
        error: null,
    };

    static getDerivedStateFromError(error: Error): State {
        return {error};
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        const {componentDidCatch, scope} = this.props;
        if (componentDidCatch) {
            componentDidCatch(error, info, scope);
        }
    }

    render() {
        const {children} = this.props;
        const {error} = this.state;

        return error ? this.renderError(error) : children;
    }

    private renderError(error: Error) {
        const {cache, renderError} = this.props;
        const recover = () => {
            if (error instanceof SuspenseError) {
                cache.expire(error.action, error.key);
            }
            this.setState({error: null});
        };
        return renderError(error instanceof SuspenseError ? error.actualError : error, recover);
    }
}
