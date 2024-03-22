import {test, expect} from 'vitest';
import {ReactNode} from 'react';
import {renderHook} from '@testing-library/react-hooks/dom';
import {createCacheProvider} from '../cache.js';

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

const api = () => Promise.resolve(123);

test('testable', async () => {
    const {result} = renderHook(
        () => useConstantResource(api),
        {wrapper: Provider}
    );
    await new Promise(r => setTimeout(r, 100));
    expect(result.current[0]).toBe(123);
});
