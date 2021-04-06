import React, {createContext, ReactNode, useContext, useMemo} from 'react';
import {SuspenseBoundaryProps} from './Boundary';

export interface BoundaryConfig {
    pendingFallback?: SuspenseBoundaryProps['pendingFallback'];
    renderError?: SuspenseBoundaryProps['renderError'];
    onErrorCaught?: SuspenseBoundaryProps['onErrorCaught'];
}

const DEFAULT_CONFIG = {
    pendingFallback: 'pending',
    renderError: () => 'error',
};
const Context = createContext<BoundaryConfig>(DEFAULT_CONFIG);
Context.displayName = 'BoundaryConfigContext';

interface Props extends BoundaryConfig {
    children: ReactNode;
}

const BoundaryConfigProvider = ({pendingFallback, renderError, onErrorCaught, children}: Props) => {
    const config = useMemo(
        () => ({pendingFallback, renderError, onErrorCaught}),
        [pendingFallback, renderError, onErrorCaught]
    );

    return (
        <Context.Provider value={config}>
            {children}
        </Context.Provider>
    );
};

export default BoundaryConfigProvider;

type OmitUndefined<T> = T extends undefined ? never : T;

interface ControlledBoundaryConfig {
    pendingFallback: OmitUndefined<SuspenseBoundaryProps['pendingFallback']>;
    renderError: OmitUndefined<SuspenseBoundaryProps['renderError']>;
    onErrorCaught?: SuspenseBoundaryProps['onErrorCaught'];
}

export const useConfigWithOverrides = (overrides: BoundaryConfig): ControlledBoundaryConfig => {
    const defaults = useContext(Context);
    return {...DEFAULT_CONFIG, ...defaults, ...overrides};
};
