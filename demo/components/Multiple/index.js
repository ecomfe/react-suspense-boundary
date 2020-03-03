import {useState} from 'react';
import {Boundary} from '../../../src';
import Loading from '../Loading';
import UserList from '../UserList';
import HostInfo from '../HostInfo';
import SourceCode from '../SourceCode';
import source from '../SourceCode/loader!./index.js';
import c from './index.less';

export default () => {
    const [key, setKey] = useState('');

    return (
        <div className={c.root}>
            <Boundary pendingFallback={<Loading />}>
                <HostInfo selected={key} onHostChange={setKey} />
                <UserList />
                <SourceCode source={source} />
            </Boundary>
        </div>
    );
};
