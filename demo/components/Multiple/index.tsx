import {useState} from 'react';
import {Boundary} from 'react-suspense-boundary';
import Loading from '../Loading/index.js';
import UserList from '../UserList/index.js';
import HostInfo from '../HostInfo/index.js';
// import SourceCode from '../SourceCode';
// import source from '../SourceCode/loader!./index.js';
// import c from './index.less';

export default function Multiple() {
    const [selectedHostId, setSelectedHostId] = useState<string>();

    return (
        <Boundary pendingFallback={<Loading />}>
            <HostInfo selectedHostId={selectedHostId} onHostChange={setSelectedHostId} />
            <UserList />
            {/* <SourceCode source={source} /> */}
        </Boundary>
    );
}
