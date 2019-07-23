import UserList from '../UserList';
import Loading from '../Loading';
import {Boundary} from '../../../src';

export default () => (
    <Boundary pendingFallback={<Loading />}>
        <UserList />
    </Boundary>
);
