import {useReducer} from 'react';
import styled from '@emotion/styled';
import 'prism-themes/themes/prism-vs.css';
import Toggle from './Toggle.js';
import Code from './Code.js';

const Layout = styled.div`
    margin-top: 10px;
`;

interface Props {
    className?: string;
    source: string;
    toggle?: boolean;
    language?: string;
}

export default function SourceCode({className, source, toggle = true, language = 'tsx'}: Props) {
    const [visible, toggleVisible] = useReducer(v => !v, !toggle);

    return (
        <Layout className={className}>
            {toggle && <Toggle visible={visible} onToggle={toggleVisible} />}
            <Code visible={visible} source={source} language={language} />
        </Layout>
    );
}
