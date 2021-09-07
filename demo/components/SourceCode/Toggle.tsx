import styled from '@emotion/styled';
import {FaCode} from 'react-icons/fa';

const Layout = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    border-top: 1px dotted #ebedf0;
    color: #aaa;
    cursor: pointer;

    &:hover {
        color: #333;
    }
`;

interface Props {
    visible: boolean;
    onToggle: () => void;
}

export default function Toggle({visible, onToggle}: Props) {
    return (
        <Layout onClick={onToggle}>
            <FaCode style={{marginRight: '.3em'}} />
            {visible ? 'Hide Source' : 'View Source'}
        </Layout>
    );
}
