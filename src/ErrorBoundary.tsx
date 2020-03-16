import React, {Component, ReactNode} from 'react';
import SuspenseError from './SuspenseError';
import ResourceCache from './ResourceCache';

interface ErrorBoundaryProps {
    cache: ResourceCache;
    renderError(error: Error, recover: () => void): ReactNode;
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

    componentDidCatch() {
        // do nothing
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
