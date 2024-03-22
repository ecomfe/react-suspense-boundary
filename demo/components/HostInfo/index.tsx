import {useEffect} from 'react';
import styled from '@emotion/styled';
import {useResource, useConstantResource, usePreloadResourceCallback} from 'react-suspense-boundary';
import api, {Host} from '../../api/host.js';
import Row from './Row.js';
import TimeChart from './TimeChart.js';
import HostSelect from './HostSelect.js';

const Layout = styled.div`
    display: flex;
    padding: 0 20px;
`;

const Info = styled.div`
    flex: 1;
`;

interface ContentProps {
    className?: string;
    selectedHostId: string;
    allHosts: Host[];
    onSelect: (id: string) => void;
}

const Content = ({className, selectedHostId, allHosts, onSelect}: ContentProps) => {
    const [{name, times, createdAt}] = useResource(api.find, selectedHostId);

    return (
        <Layout className={className}>
            <Info>
                <Row title="ID">{selectedHostId}</Row>
                <Row title="Name">{name}</Row>
                <Row title="Created">{createdAt.toLocaleString()}</Row>
                <HostSelect allHosts={allHosts} selectedHostId={selectedHostId} onSelect={onSelect} />
            </Info>
            <TimeChart {...times} />
        </Layout>
    );
};

interface Props {
    className?: string;
    selectedHostId?: string;
    onHostChange: (id: string) => void;
}

export default function HostInfo({className, selectedHostId, onHostChange}: Props) {
    const [allHosts] = useConstantResource(api.list);
    const id = selectedHostId ?? allHosts[0].id;
    const preload = usePreloadResourceCallback();
    useEffect(
        () => {
            const index = allHosts.findIndex(v => v.id === id);
            const previousId = allHosts[index - 1]?.id;
            const nextId = allHosts[index + 1]?.id;
            if (previousId) {
                preload(api.find, previousId);
            }
            if (nextId) {
                preload(api.find, nextId);
            }
        },
        [allHosts, id, preload]
    );

    return <Content className={className} selectedHostId={id} allHosts={allHosts} onSelect={onHostChange} />;
}
