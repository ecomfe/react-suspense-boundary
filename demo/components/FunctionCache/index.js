import {Boundary} from '../../../src';
import UserList from '../UserList';
import Loading from '../Loading';
import SourceCode from '../SourceCode';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions
import source from '../SourceCode/loader!./index.js';

export default () => (
    <Boundary cacheMode="function" pendingFallback={<Loading />}>
        <UserList />
        <SourceCode source={source} />
    </Boundary>
);
