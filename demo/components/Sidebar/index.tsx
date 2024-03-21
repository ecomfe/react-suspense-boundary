import styled from '@emotion/styled';
import NavItem from './NavItem';

const GITHUB_URL_BASE = 'https://github.com/ecomfe/react-suspense-boundary';

const GITHUB_BLOB_URL_BASE = `${GITHUB_URL_BASE}/tree/master`;

const Title = styled.h3`
    padding-left: 10px;
    color: #666;
    margin-top: 20px;

    &:first-of-type {
        margin-top: 0;
    }
`;

interface Props {
    className?: string;
}

export default function Sidebar({className}: Props) {
    return (
        <aside className={className}>
            <Title>Examples</Title>
            <nav>
                <NavItem to="/simple">Simple</NavItem>
                <NavItem to="/multiple">Multiple Async Components</NavItem>
                <NavItem to="/nested">Nested Boundary</NavItem>
                <NavItem to="/self-loading">Loading On Self</NavItem>
                <NavItem to="/manual-control">Manual Expire And Refresh</NavItem>
                <NavItem to="/async-error">Async Error Boundary</NavItem>
                <NavItem to="/error-recovery">Recover From Error</NavItem>
                <NavItem to="/concurrent-lazy-loading">Concurrent Lazy Loading</NavItem>
            </nav>
            <Title>Related Source</Title>
            <nav>
                <NavItem.External to={`${GITHUB_BLOB_URL_BASE}/demo/components/HostInfo/index.tsx`}>
                    HostInfo
                </NavItem.External>
                <NavItem.External to={`${GITHUB_BLOB_URL_BASE}/demo/components/UserList/index.tsx`}>
                    UserList
                </NavItem.External>
                <NavItem.External to={`${GITHUB_BLOB_URL_BASE}/demo/components/Progress/index.tsx`}>
                    Progress
                </NavItem.External>
            </nav>
            <Title>Resources</Title>
            <nav>
                <NavItem.External to={`${GITHUB_URL_BASE}#readme`}>README</NavItem.External>
                <NavItem.External to="https://reactjs.org/docs/react-api.html#reactsuspense">
                    React Suspense
                </NavItem.External>
            </nav>
        </aside>
    );
}
