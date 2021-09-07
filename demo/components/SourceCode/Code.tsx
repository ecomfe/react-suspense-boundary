import styled from '@emotion/styled';
import {Global, css} from '@emotion/react';
import Refractor from 'react-refractor';
import jsx from 'refractor/lang/jsx';
import tsx from 'refractor/lang/tsx';
import bash from 'refractor/lang/bash';
import {useMemo} from 'react';

Refractor.registerLanguage(jsx);
Refractor.registerLanguage(tsx);
Refractor.registerLanguage(bash);

const Layout = styled.div`
    display: flex;
`;

const Gutter = styled.div`
    font-family: "Lucida Console", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    line-height: 1.5;
    width: 5ch;
    padding-right: 2ch;
    text-align: right;
    color: #1b1f234d;
    user-select: none;
`;

const LineNumber = styled.span`
    display: block;
`;

const globalCodeStyle = css`
    pre[class*="language-"],
    code[class*="language-"] {
        font-family: "Lucida Console", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
        line-height: 1.5;
    }
`;

interface Props {
    visible: boolean;
    source: string;
    language: string;
}

export default function Code({visible, source, language}: Props) {
    const text = useMemo(
        () => source
            .replace(/import SourceCode from.+\n/, '')
            .replace(/import source from '.+\?source';\n/g, '')
            .replace(/\s+<SourceCode .+/g, '')
            .replace(/\n{3,}/g, '\n\n'),
        [source]
    );
    const lineNumbers = useMemo(
        () => text.split('\n').map((t, i) => i + 1),
        [text]
    );

    return (
        <>
            <Global styles={globalCodeStyle} />
            <Layout style={{display: visible ? '' : 'none'}}>
                <Gutter>
                    {lineNumbers.map(i => <LineNumber key={i}>{i}</LineNumber>)}
                </Gutter>
                <Refractor language={language} value={text} />
            </Layout>
        </>
    );
}
