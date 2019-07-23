import UserList from '../UserList';
import Loading from '../Loading';
import {Boundary} from '../../../src';

export default () => (
    <Boundary cacheMode="function" pendingFallback={<Loading />}>
        <UserList />
    </Boundary>
);
