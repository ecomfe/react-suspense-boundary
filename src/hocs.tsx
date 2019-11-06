import {ComponentType, SFC, Fragment} from 'react';
import Boundary, {SuspenseBoundaryProps} from './Boundary';

type Factory<T, P> = T | ((props: P) => T);

interface WithBoundaryOptions<P> extends Partial<Omit<SuspenseBoundaryProps, 'pendingFallback'>> {
    pendingFallback?: Factory<SuspenseBoundaryProps['pendingFallback'], P>;
}

export function withBoundary<P>(options: WithBoundaryOptions<P> = {}) {
    const {is = Fragment, pendingFallback: pendingFactory, ...boundaryProps} = options;

    return (ComponentIn: ComponentType<P>): SFC<P> => {
        const ComponentOut: SFC<P> = props => {
            const pendingFallback = typeof pendingFactory === 'function' ? pendingFactory(props) : pendingFactory;
            return (
                <Boundary is={is} pendingFallback={pendingFallback} {...boundaryProps}>
                    <ComponentIn {...props} />
                </Boundary>
            );
        };
        const displayNameIn = ComponentIn.displayName || ComponentIn.name || 'Unknown';
        ComponentOut.displayName = `withBoundary(${displayNameIn})`;
        return ComponentOut;
    };
}
