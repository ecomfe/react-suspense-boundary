import {test, expect} from 'vitest';
import {ReactNode} from 'react';
import {renderHook} from '@testing-library/react-hooks';
import CacheProvider, {useConstantResource} from '../CacheProvider';

interface ProviderProps {
    children?: ReactNode;
}

function Provider({children}: ProviderProps) {
    return (
        <CacheProvider>
            {children}
        </CacheProvider>
    );
}

const api = () => Promise.resolve(123);

test('testable', async () => {
    const {result, waitForNextUpdate} = renderHook(
        () => useConstantResource(api),
        {wrapper: Provider}
    );
    await waitForNextUpdate();
    expect(result.current[0]).toBe(123);
});
