import {Button} from 'antd';
import {Boundary} from '../../../src';
import Progress from '../Progress';
import Loading from '../Loading';
import SourceCode from '../SourceCode';
import source from '../SourceCode/loader!./index.js';
import c from './index.less';

const renderError = (error, recover) => (
    <div className={c.error}>
        <p style={{fontSize: 24}}>Something went wrong: {error.message}</p>
        <Button type="danger" onClick={recover}>Retry It</Button>
    </div>
);

export default () => (
    <Boundary pendingFallback={<Loading />} renderError={renderError}>
        <Progress />
        <SourceCode source={source} />
    </Boundary>
);
