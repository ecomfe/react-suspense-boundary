import {Boundary} from '../../../src';
import UserList from '../UserList';

export default () => (
    <Boundary cacheMode="function" pendingFallback={<UserList skeleton />}>
        <UserList controllable />
    </Boundary>
);
