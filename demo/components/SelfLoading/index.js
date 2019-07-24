import {Boundary} from '../../../src';
import UserList from '../UserList';
import SourceCode from '../SourceCode';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions
import source from '../SourceCode/loader!./index.js';

export default () => (
    <Boundary cacheMode="function" pendingFallback={<UserList skeleton />}>
        <UserList />
        <SourceCode source={source} />
    </Boundary>
);
