import {test, expect} from 'vitest';
import {ReactNode} from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {createCacheProvider} from '../cache';

const {CacheProvider, useConstantResource} = createCacheProvider({contextDisplayName: 'CacheContext'});

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

test('testable', async () => {
    let value = 123;
    const api = () => Promise.resolve(value++);
    const {result, waitForNextUpdate} = renderHook(
        () => useConstantResource(api),
        {wrapper: Provider}
    );
    await waitForNextUpdate();
    await act(() => result.current[1].refresh());
    expect(result.current[0]).toBe(124);
});
