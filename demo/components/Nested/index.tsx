import {useState} from 'react';
import {Boundary} from 'react-suspense-boundary';
import Loading from '../Loading';
import UserList from '../UserList';
import HostInfo from '../HostInfo';
// import SourceCode from '../SourceCode';
// import source from '../SourceCode/loader!./index.js';
// import c from './index.less';

export default function Nested() {
    const [selectedHostId, setSelectedHostId] = useState<string>();

    return (
        <div>
            <Boundary pendingFallback={<Loading />}>
                <Boundary pendingFallback={<Loading style={{minHeight: 240}} />}>
                    <HostInfo selectedHostId={selectedHostId} onHostChange={setSelectedHostId} />
                </Boundary>
                <UserList />
                {/* <SourceCode source={source} /> */}
            </Boundary>
        </div>
    );
}
