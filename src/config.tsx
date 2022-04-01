import {ComponentProps, createContext, ReactElement, ReactNode, useContext, useMemo} from 'react';
import ErrorBoundary from './ErrorBoundary.js';

type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;

export interface BoundaryConfig {
    pendingFallback: ReactElement | null;
    renderError: ErrorBoundaryProps['renderError'];
    onErrorCaught?: ErrorBoundaryProps['onErrorCaught'];
}

const DEFAULT_CONFIG = {
    pendingFallback: null,
    renderError: () => {
        throw new Error('No renderError configured in BoundaryConfigProvider or passed by Boundary props');
    },
};

export interface Props extends BoundaryConfig {
    children: ReactNode;
}

interface Options {
    contextDisplayName?: string;
}

export const createConfigProvider = ({contextDisplayName = 'BoundaryConfigContext'}: Options) => {
    const Context = createContext<BoundaryConfig>(DEFAULT_CONFIG);
    Context.displayName = contextDisplayName;

    function BoundaryConfigProvider({pendingFallback, renderError, onErrorCaught, children}: Props) {
        const config = useMemo(
            () => ({pendingFallback, renderError, onErrorCaught}),
            [pendingFallback, renderError, onErrorCaught]
        );

        return (
            <Context.Provider value={config}>
                {children}
            </Context.Provider>
        );
    }

    function useBoundaryConfig() {
        return useContext(Context);
    }

    return {
        BoundaryConfigProvider,
        useBoundaryConfig,
    };
};

