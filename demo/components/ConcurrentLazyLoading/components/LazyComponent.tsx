import {Boundary, CacheProvider} from 'react-suspense-boundary';
import UserList from '../../../components/UserList';

const Error = () => <h1>Error</h1>;

export default function LazyComponent() {
    return (
        <div>
            <CacheProvider>
                <Boundary pendingFallback={<h1>Loading...</h1>} renderError={Error}>
                    <UserList />
                </Boundary>
            </CacheProvider>
        </div>
    );
}
