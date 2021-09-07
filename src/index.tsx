import {ComponentType} from 'react';
import {default as Boundary, SuspenseBoundaryProps} from './Boundary';

export {Boundary};
export {
    default as CacheProvider,
    useResource,
    useConstantResource,
    usePreloadResource,
    usePreloadConstantResource,
    usePreloadResourceCallback,
    useExpireCache,
    useRefreshCache,
} from './CacheProvider';
export {default as ErrorBoundary} from './ErrorBoundary';
export {default as BoundaryConfigProvider} from './ConfigProvider';

export type {SuspenseBoundaryProps};
export type {RenderErrorOptions} from './ErrorBoundary';
export type {CacheController, ResourceController} from './interface';

type Factory<T, P> = T | ((props: P) => T);

export interface WithBoundaryOptions<P = unknown> extends Partial<Omit<SuspenseBoundaryProps, 'pendingFallback'>> {
    pendingFallback?: Factory<SuspenseBoundaryProps['pendingFallback'], P>;
}

export function withBoundary(options: WithBoundaryOptions = {}) {
    const {pendingFallback: pendingFactory, ...boundaryProps} = options;

    return function withBoundaryIn<P>(ComponentIn: ComponentType<P>): ComponentType<P> {
        function ComponentOut(props: P) {
            const pendingFallback = typeof pendingFactory === 'function' ? pendingFactory(props) : pendingFactory;

            return (
                <Boundary pendingFallback={pendingFallback} {...boundaryProps}>
                    <ComponentIn {...props} />
                </Boundary>
            );
        }
        ComponentOut.displayName = `withBoundary(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;
        return ComponentOut;
    };
}
