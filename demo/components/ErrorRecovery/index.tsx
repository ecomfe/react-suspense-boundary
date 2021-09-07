import styled from '@emotion/styled';
import {Button} from 'antd';
import {Boundary, RenderErrorOptions} from 'react-suspense-boundary';
import Progress from '../Progress';
import Loading from '../Loading';
// import SourceCode from '../SourceCode';
// import source from '../SourceCode/loader!./index.js';

const ErrorLayout = styled.div`
    border: 2px solid red;
    padding: 10px;
    text-align: center;
`;

const renderError = (error: Error, {recover}: RenderErrorOptions) => (
    <ErrorLayout>
        <p style={{fontSize: 24}}>Something went wrong: {error.message}</p>
        <Button danger onClick={recover}>Retry It</Button>
    </ErrorLayout>
);

export default () => (
    <Boundary pendingFallback={<Loading />} renderError={renderError}>
        <Progress />
        {/* <SourceCode source={source} /> */}
    </Boundary>
);
