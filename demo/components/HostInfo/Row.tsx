import {ReactNode} from 'react';
import styled from '@emotion/styled';

const Layout = styled.div`
    line-height: 3;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 120px 1fr;
    column-gap: 20px;
`;

const Title = styled.span`
    text-align: right;

    &::after {
        content: ":";
    }
`;

interface Props {
    title: string;
    children: ReactNode;
}

export default function Row({title, children}: Props) {
    return (
        <Layout>
            <Title>
                {title}
            </Title>
            <span>
                {children}
            </span>
        </Layout>
    );
}
