import {useRef, useEffect, useReducer} from 'react';
import {render} from 'react-dom';
import Markdown from 'react-markdown';
import SourceCode from '../SourceCode';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions
import readme from '../SourceCode/loader!../../../README.md';
import c from './index.less';

export default () => {
    const ref = useRef(null);
    const [ready, goReady] = useReducer(() => true, false);
    useEffect(
        () => {
            const container = ref.current;

            if (!container) {
                return;
            }

            const blocks = container.querySelectorAll('pre');
            for (const block of blocks) {
                const sourceCode = block.innerText;
                const language = block.querySelector('code').className.replace(/^language-/, '');
                const container = block.parentNode.insertBefore(document.createElement('div'), block);
                block.remove();
                render(
                    <SourceCode className={c.code} language={language} source={sourceCode} toggle={false} />,
                    container
                );
            }

            goReady();
        },
        []
    );

    return (
        <article className={c.root} style={{display: ready ? '' : 'none'}} ref={ref}>
            <Markdown source={readme} />
        </article>
    );
};
