import {Boundary} from '../../../src';
import UserList from '../UserList';
import SourceCode from '../SourceCode';
import source from '../SourceCode/loader!./index.js';

export default () => (
    <Boundary cacheMode="function" pendingFallback={<UserList skeleton />}>
        <UserList />
        <SourceCode source={source} />
    </Boundary>
);
