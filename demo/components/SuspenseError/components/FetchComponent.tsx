import {Boundary, CacheProvider, useResource} from 'react-suspense-boundary';

// const OtherComponents = lazy(() => import('./OtherComponent'));

const getData = () => new Promise<string>((resolve, reject) => {
    console.log('发起请求');
    setTimeout(() => {
        console.log('请求返回');
        resolve('数据返回了');
        // reject('请求出错了');
    }, 10);
});
const param = {};
const Component = () => {
    console.log('Component before useResource');
    const [data] = useResource(getData, param);
    console.log('Component after useResource');
    return <>{data}</>;
};

const Error = () => <h1>Error</h1>;

export default function FetchComponents() {
    // console.log('FetchComponents');
    return (
        <div>
            <CacheProvider>
                <Boundary pendingFallback={<h1>Loading...</h1>} renderError={Error}>
                    <Component />
                </Boundary>
            </CacheProvider>
        </div>
    );
}
