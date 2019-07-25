import {FaBug} from 'react-icons/fa';
import {Alert} from 'antd';
import {Boundary} from '../../../src';
import UserList from '../UserList';
import Loading from '../Loading';
import SourceCode from '../SourceCode';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions
import source from '../SourceCode/loader!./index.js';
import c from './index.less';

const Error = ({message}) => (
    <div className={c.error}>
        <FaBug style={{fill: '#d8000c'}} />
        {message}
    </div>
);

const renderError = error => <Error message={error.message} />;

export default () => (
    <Boundary pendingFallback={<Loading />} renderError={renderError}>
        <Alert
            type="warning"
            message={
                <>
                    This example is not working as expected currently due to
                    {' '}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/facebook/react/issues/16199"
                    >
                        a bug in react
                    </a>
                    .
                </>
            }
        />
        <UserList crashable />
        <SourceCode source={source} />
    </Boundary>
);
