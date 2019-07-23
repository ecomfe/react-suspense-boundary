import {useState} from 'react';
import {Boundary} from '../../../src';
import Loading from '../Loading';
import UserList from '../UserList';
import HostInfo from '../HostInfo';
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
