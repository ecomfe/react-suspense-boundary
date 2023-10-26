import {Suspense, lazy} from 'react';

const FetchComponents = lazy(() => import('./components/FetchComponent'));
const FetchComponents2 = () => {
    // console.log('******************* FetchComponents Out **********************');
    return <FetchComponents />;
};

function SuspenseError() {
    return (
        <>
            <h1>SuspenseError</h1>
            <Suspense fallback={<h1>Component Loading</h1>}>
                <FetchComponents2 />
            </Suspense>
        </>
    );
}

export default SuspenseError;
