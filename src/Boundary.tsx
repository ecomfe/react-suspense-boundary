import {Suspense, ReactNode, ComponentProps} from 'react';
import CacheProvider, {useExpireCache} from './CacheProvider';
import {useBoundaryConfig, BoundaryConfig} from './ConfigProvider';
import ErrorBoundary from './ErrorBoundary';

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

function SuspenseBoundaryNoCache(props: SuspenseBoundaryProps) {
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

function SuspenseBoundary(props: SuspenseBoundaryProps) {
    return (
        <CacheProvider>
            <SuspenseBoundaryNoCache {...props} />
        </CacheProvider>
    );
}

SuspenseBoundary.NoCache = SuspenseBoundaryNoCache;

export default SuspenseBoundary;
