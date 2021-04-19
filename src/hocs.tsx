import React, {ComponentType, FC} from 'react';
import Boundary, {SuspenseBoundaryProps} from './Boundary';

type Factory<T, P> = T | ((props: P) => T);

export interface WithBoundaryOptions<P = {}> extends Partial<Omit<SuspenseBoundaryProps, 'pendingFallback'>> {
    pendingFallback?: Factory<SuspenseBoundaryProps['pendingFallback'], P>;
}

export function withBoundary(options: WithBoundaryOptions = {}) {
    const {pendingFallback: pendingFactory, ...boundaryProps} = options;

    return function withBoundaryIn<P>(ComponentIn: ComponentType<P>): FC<P> {
        const ComponentOut: FC<P> = props => {
            const pendingFallback = typeof pendingFactory === 'function' ? pendingFactory(props) : pendingFactory;
            return (
                <Boundary pendingFallback={pendingFallback} {...boundaryProps}>
                    <ComponentIn {...props} />
                </Boundary>
            );
        };
        const displayNameIn = ComponentIn.displayName || ComponentIn.name || 'Unknown';
        ComponentOut.displayName = `withBoundary(${displayNameIn})`;
        return ComponentOut;
    };
}
