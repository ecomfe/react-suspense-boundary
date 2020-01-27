import {useState, Fragment} from 'react';
import {Boundary} from '../../../src';
import Loading from '../Loading';
import UserList from '../UserList';
import HostInfo from '../HostInfo';
import SourceCode from '../SourceCode';
import source from '../SourceCode/loader!./index.js';
import c from './index.less';

export default () => {
    const [selected, select] = useState('');

    return (
        <Boundary className={c.root} pendingFallback={<Loading />}>
            <Boundary is={Fragment} pendingFallback={<Loading style={{minHeight: 240}} />}>
                <HostInfo selected={selected} onHostChange={select} />
            </Boundary>
            <UserList />
            <SourceCode source={source} />
        </Boundary>
    );
};
