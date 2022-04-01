import {Suspense, ReactNode, ComponentProps, ComponentType, ComponentRef, forwardRef} from 'react';
import ErrorBoundary from './ErrorBoundary.js';
import {BoundaryConfig} from './config.js';
import {CacheController} from './interface.js';

type Factory<T, P> = T | ((props: P) => T);

export interface WithBoundaryOptions<P = unknown> extends Partial<Omit<SuspenseBoundaryProps, 'pendingFallback'>> {
    pendingFallback?: Factory<SuspenseBoundaryProps['pendingFallback'], P>;
}

type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;

export interface SuspenseBoundaryProps {
    pendingFallback?: BoundaryConfig['pendingFallback'];
    renderError?: BoundaryConfig['renderError'];
    children: ReactNode;
    onErrorCaught?: BoundaryConfig['onErrorCaught'];
}

interface FactoryOptions {
    useExpireCache: () => CacheController;
    useBoundaryConfig: () => BoundaryConfig;
}

export const createSuspenseBoundary = (options: FactoryOptions) => {
    const {useExpireCache, useBoundaryConfig} = options;

    function CacheConnectedErrorBoundary(props: Omit<ErrorBoundaryProps, 'onExpireResource'>) {
        const expire = useExpireCache();

        return <ErrorBoundary onExpireResource={expire} {...props} />;
    }

    function SuspenseBoundary(props: SuspenseBoundaryProps) {
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

    function withBoundary(options: WithBoundaryOptions = {}) {
        const {pendingFallback: pendingFactory, ...boundaryProps} = options;

        return function withBoundaryIn<P>(ComponentIn: ComponentType<P>): ComponentType<P> {
            const ComponentOut = forwardRef<ComponentRef<typeof ComponentIn>, ComponentProps<typeof ComponentIn>>(
                function ComponentOut(props, ref) {
                    const pendingFallback = typeof pendingFactory === 'function'
                        ? pendingFactory(props)
                        : pendingFactory;

                    return (
                        <SuspenseBoundary pendingFallback={pendingFallback} {...boundaryProps}>
                            <ComponentIn ref={ref} {...props} />
                        </SuspenseBoundary>
                    );
                }
            );
            ComponentOut.displayName = `withBoundary(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;
            return ComponentOut as unknown as typeof ComponentIn;
        };
    }


    return {
        Boundary: SuspenseBoundary,
        withBoundary,
    };
};
