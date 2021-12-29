import {Component, ReactNode, ErrorInfo} from 'react';
import {CacheController} from './interface.js';
import SuspenseError from './SuspenseError.js';

export interface RenderErrorOptions {
    recover: () => void;
}

interface ErrorBoundaryProps {
    renderError: (error: Error, options: RenderErrorOptions) => ReactNode;
    children: ReactNode;
    onExpireResource?: CacheController;
    onErrorCaught?: (error: Error, info: ErrorInfo) => void;
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
        const {onErrorCaught} = this.props;
        if (onErrorCaught) {
            onErrorCaught(error instanceof SuspenseError ? error.cause : error, info);
        }
    }

    render() {
        const {children} = this.props;
        const {error} = this.state;

        return error ? this.renderError(error) : children;
    }

    private renderError(error: Error) {
        const {renderError, onExpireResource} = this.props;
        const recover = () => {
            if (error instanceof SuspenseError) {
                onExpireResource?.(error.action, error.params);
            }
            this.setState({error: null});
        };
        return renderError(error instanceof SuspenseError ? error.cause : error, {recover});
    }
}
