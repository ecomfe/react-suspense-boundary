import {Suspense, lazy} from 'react';

const LazyComponent = lazy(() => import('./components/LazyComponent'));

function ConcurrentLazyLoading() {
    return (
        <>
            <Suspense fallback={<h1>Component Loading</h1>}>
                <LazyComponent />
            </Suspense>
        </>
    );
}

export default ConcurrentLazyLoading;
