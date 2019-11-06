import {ComponentType, SFC, Fragment} from 'react';
import Boundary, {SuspenseBoundaryProps} from './Boundary';

interface WithBoundaryOptions<P> extends Partial<Omit<SuspenseBoundaryProps, 'pendingFallback'>> {
    createPendingFallback?(props: P): SuspenseBoundaryProps['pendingFallback'];
}

export function withBoundary<P>(options: WithBoundaryOptions<P> = {}) {
    const {
        is = Fragment,
        createPendingFallback = () => undefined,
        ...boundaryProps
    } = options;

    return (ComponentIn: ComponentType<P>): SFC<P> => {
        const ComponentOut: SFC<P> = props => {
            const pendingFallback = createPendingFallback(props);
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
