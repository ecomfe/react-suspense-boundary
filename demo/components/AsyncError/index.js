import {FaBug} from 'react-icons/fa';
import {Boundary} from '../../../src';
import UserList from '../UserList';
import Loading from '../Loading';
import SourceCode from '../SourceCode';
import source from '../SourceCode/loader!./index.js';
import c from './index.less';

const Error = ({message}) => (
    <>
        <div className={c.error}>
            <FaBug className={c.errorIcon} />
            Oops! {message}
        </div>
        <SourceCode source={source} />
    </>
);

const renderError = error => <Error message={error.message} />;

export default () => (
    <Boundary pendingFallback={<Loading />} renderError={renderError}>
        <UserList crashable />
        <SourceCode source={source} />
    </Boundary>
);
