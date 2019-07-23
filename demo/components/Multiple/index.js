import {useState} from 'react';
import Loading from '../Loading';
import UserList from '../UserList';
import HostInfo from './HostInfo';
import {Boundary} from '../../../src';
import c from './index.less';

export default () => {
    const [key, setKey] = useState('');

    return (
        <Boundary key={key} className={c.root} pendingFallback={<Loading />}>
            <HostInfo selected={key} onHostChange={setKey} />
            <UserList />
        </Boundary>
    );
};
