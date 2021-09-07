import {Boundary} from 'react-suspense-boundary';
import UserList from '../UserList';
// import SourceCode from '../SourceCode';
// import source from '../SourceCode/loader!./index.js';

export default function ManualControl() {
    return (
        <Boundary pendingFallback={<UserList.Skeleton />}>
            <UserList controllable />
            {/* <SourceCode source={source} /> */}
        </Boundary>
    );
}
