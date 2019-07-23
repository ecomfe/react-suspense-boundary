import {Boundary} from '../../../src';
import UserList from '../UserList';
import Loading from '../Loading';

export default () => (
    <Boundary cacheMode="function" pendingFallback={<Loading />}>
        <UserList />
    </Boundary>
);
