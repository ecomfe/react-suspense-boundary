import {Boundary} from '../../../src';
import UserList from '../UserList';
import Loading from '../Loading';

export default () => (
    <Boundary pendingFallback={<Loading />}>
        <UserList />
    </Boundary>
);
