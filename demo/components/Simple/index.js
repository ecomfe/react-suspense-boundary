import {Boundary} from '../../../src';
import UserList from '../UserList';
import Loading from '../Loading';
import SourceCode from '../SourceCode';
import source from '../SourceCode/loader!./index.js';

export default () => (
    <Boundary pendingFallback={<Loading />}>
        <UserList />
        <SourceCode source={source} />
    </Boundary>
);
