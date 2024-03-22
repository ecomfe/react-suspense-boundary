import styled from '@emotion/styled';
import {FaBug} from 'react-icons/fa';
import {Boundary} from 'react-suspense-boundary';
import UserList from '../UserList/index.js';
import Loading from '../Loading/index.js';
// import SourceCode from '../SourceCode';
// import source from '../SourceCode/loader!./index.js';

const ErrorLayout = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 120px 0;
    font-size: 30px;
`;

const ErrorIcon = styled(FaBug)`
    fill: #d8000c;
    width: 1em;
    height: 1em;
    margin-right: .5em;
`;

interface ErrorProps {
    message: string;
}

const Error = ({message}: ErrorProps) => (
    <>
        <ErrorLayout>
            <ErrorIcon />
            Oops! {message}
        </ErrorLayout>
        {/* <SourceCode source={source} /> */}
    </>
);

const renderError = (error: Error) => <Error message={error.message} />;

export default function AsyncError() {
    return (
        <Boundary pendingFallback={<Loading />} renderError={renderError}>
            <UserList crashable />
            {/* <SourceCode source={source} /> */}
        </Boundary>
    );
}
