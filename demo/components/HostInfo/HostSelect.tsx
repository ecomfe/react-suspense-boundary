import {useCallback} from 'react';
import {Tag} from 'antd';
import styled from '@emotion/styled';
import {Host} from '../../api/host';

const CheckableTag = styled(Tag.CheckableTag)`
    font-size: 14px;
    margin-bottom: 10px;
`;

interface TagProps {
    id: string;
    name: string;
    selected: boolean;
    onSelect: (id: string) => void;
}

function HostTag({id, name, selected, onSelect}: TagProps) {
    const select = useCallback(
        (checked: boolean) => {
            if (checked) {
                onSelect(id);
            }
        },
        [id, onSelect]
    );

    return <CheckableTag checked={selected} onChange={select}>{name}</CheckableTag>;
}

const Layout = styled.div`
    margin: 40px 20px 10px;
`;

interface Props {
    allHosts: Host[];
    selectedHostId: string;
    onSelect: (id: string) => void;
}

export default function HostSelect({selectedHostId, allHosts, onSelect}: Props) {
    const renderTag = ({id, name}: Host) => (
        <HostTag
            key={id}
            id={id}
            name={name}
            selected={id === selectedHostId}
            onSelect={onSelect}
        />
    );

    return (
        <Layout>
            {allHosts.map(renderTag)}
        </Layout>
    );
}
