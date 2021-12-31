import {ComponentProps, ComponentType, ComponentRef, forwardRef} from 'react';
import {default as Boundary, SuspenseBoundaryProps} from './Boundary.js';

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
} from './CacheProvider.js';
export {default as ErrorBoundary} from './ErrorBoundary.js';
export {default as BoundaryConfigProvider} from './ConfigProvider.js';

export type {SuspenseBoundaryProps};
export type {RenderErrorOptions} from './ErrorBoundary.js';
export type {CacheController, ResourceController} from './interface.js';

type Factory<T, P> = T | ((props: P) => T);

export interface WithBoundaryOptions<P = unknown> extends Partial<Omit<SuspenseBoundaryProps, 'pendingFallback'>> {
    pendingFallback?: Factory<SuspenseBoundaryProps['pendingFallback'], P>;
}

export function withBoundary(options: WithBoundaryOptions = {}) {
    const {pendingFallback: pendingFactory, ...boundaryProps} = options;

    return function withBoundaryIn<P>(ComponentIn: ComponentType<P>): ComponentType<P> {
        const ComponentOut = forwardRef<ComponentRef<typeof ComponentIn>, ComponentProps<typeof ComponentIn>>(
            function ComponentOut(props, ref) {
                const pendingFallback = typeof pendingFactory === 'function' ? pendingFactory(props) : pendingFactory;

                return (
                    <Boundary pendingFallback={pendingFallback} {...boundaryProps}>
                        <ComponentIn ref={ref} {...props} />
                    </Boundary>
                );
            }
        );
        ComponentOut.displayName = `withBoundary(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;
        return ComponentOut as unknown as typeof ComponentIn;
    };
}
