import {Suspense, lazy} from 'react';
// import FetchComponents from "./components/FetchComponent";

const FetchComponents = lazy(() => import('./components/FetchComponent'));

function SuspenseError() {
    return (
        <>
            <h1>SuspenseError</h1>
            <Suspense fallback={<h1>Component Loading</h1>}>
                <FetchComponents />
            </Suspense>
        </>
    );
}

export default SuspenseError;
