import {Suspense, lazy} from 'react';
import styled from '@emotion/styled';
import {Global, css} from '@emotion/react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {BoundaryConfigProvider} from 'react-suspense-boundary';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Simple from '../Simple';
import Multiple from '../Multiple';
import Nested from '../Nested';
import SelfLoading from '../SelfLoading';
import ManualControl from '../ManualControl';
import AsyncError from '../AsyncError';
import ErrorRecovery from '../ErrorRecovery';

const ConcurrentLazyLoading = lazy(() => import('../ConcurrentLazyLoading'));
const globalStyle = css`
    html,
    body {
        margin: 0;
    }
`;

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Content = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 300px 1fr;
`;

const Main = styled.main`
    padding: 0 20px;
`;

const renderError = () => <div>ERROR!</div>;

export default () => (
    <BoundaryConfigProvider pendingFallback={null} renderError={renderError}>
        <Global styles={globalStyle} />
        <Layout>
            <Header />
            <Content>
                <Sidebar />
                <Main>
                    <Routes>
                        <Route path="/simple" element={<Simple />} />
                        <Route path="/multiple" element={<Multiple />} />
                        <Route path="/nested" element={<Nested />} />
                        <Route path="/self-loading" element={<SelfLoading />} />
                        <Route path="/manual-control" element={<ManualControl />} />
                        <Route path="/async-error" element={<AsyncError />} />
                        <Route path="/error-recovery" element={<ErrorRecovery />} />
                        <Route
                            path="/concurrent-lazy-loading"
                            element={
                                <Suspense fallback={<h1>Loading...</h1>}>
                                    <ConcurrentLazyLoading />
                                </Suspense>
                            }
                        />
                        <Route element={<Navigate replace to="/simple" />} />
                    </Routes>
                </Main>
            </Content>
        </Layout>
    </BoundaryConfigProvider>
);
