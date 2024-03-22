import {Boundary} from 'react-suspense-boundary';
import UserList from '../UserList/index.js';
// import SourceCode from '../SourceCode';
// import source from '../SourceCode/loader!./index.js';

export default () => (
    <Boundary pendingFallback={<UserList.Skeleton />}>
        <UserList />
        {/* <SourceCode source={source} /> */}
    </Boundary>
);
