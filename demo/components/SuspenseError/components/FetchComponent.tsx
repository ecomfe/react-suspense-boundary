import {Boundary, CacheProvider, useResource} from 'react-suspense-boundary';
let count = 0;
const getData = () => new Promise<string>(resolve => {
    count++;
    setTimeout(() => {
        resolve('数据返回了');
    }, 100);
});

const param = {};
const Component = () => {
    const [data] = useResource(getData, param);
    return <>{data}, 请求发起了{count}次</>;
};

const Error = () => <h1>Error</h1>;

export default function FetchComponents() {
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
