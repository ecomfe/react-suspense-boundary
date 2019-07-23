import UserList from '../UserList';
import {Boundary} from '../../../src';

export default () => (
    <Boundary cacheMode="function" pendingFallback={<UserList skeleton />}>
        <UserList controllable />
    </Boundary>
);
