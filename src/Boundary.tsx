import {Suspense, ReactNode, ComponentProps} from 'react';
import {useExpireCache} from './CacheProvider.js';
import {useBoundaryConfig, BoundaryConfig} from './ConfigProvider.js';
import ErrorBoundary from './ErrorBoundary.js';

type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;

function CacheConnectedErrorBoundary(props: Omit<ErrorBoundaryProps, 'onExpireResource'>) {
    const expire = useExpireCache();

    return <ErrorBoundary onExpireResource={expire} {...props} />;
}

export interface SuspenseBoundaryProps {
    pendingFallback?: BoundaryConfig['pendingFallback'];
    renderError?: BoundaryConfig['renderError'];
    children: ReactNode;
    onErrorCaught?: BoundaryConfig['onErrorCaught'];
}

export default function SuspenseBoundary(props: SuspenseBoundaryProps) {
    const defaultConfig = useBoundaryConfig();
    const {
        pendingFallback = defaultConfig.pendingFallback,
        renderError = defaultConfig.renderError,
        children,
        onErrorCaught = defaultConfig.onErrorCaught,
    } = props;

    return (
        <CacheConnectedErrorBoundary renderError={renderError} onErrorCaught={onErrorCaught}>
            <Suspense fallback={pendingFallback}>
                {children}
            </Suspense>
        </CacheConnectedErrorBoundary>
    );
}
