import {useReducer, useMemo} from 'react';
import {FaCode} from 'react-icons/fa';
import Refractor from 'react-refractor';
import jsx from 'refractor/lang/jsx';
import tsx from 'refractor/lang/tsx';
import bash from 'refractor/lang/bash';
import 'prism-themes/themes/prism-vs.css';
import c from './index.less';

Refractor.registerLanguage(jsx);
Refractor.registerLanguage(tsx);
Refractor.registerLanguage(bash);

const SourceCode = ({className, source, toggle, language}) => {
    const [visible, toggleVisible] = useReducer(v => !v, !toggle);
    const text = useMemo(
        () => source
            .replace('../../../src', 'react-suspense-boundary')
            .replace(/import SourceCode from.+\n/, '')
            .replace(/\/\/ eslint-disable-next-line import\/no-webpack-loader-syntax.+\n/g, '')
            .replace(/import source from '..\/SourceCode\/loader.+\n/g, '')
            .replace(/\s+<SourceCode .+/g, '')
            .replace(/\n{3,}/g, '\n\n'),
        [source]
    );
    const lineNumbers = useMemo(
        () => text.split('\n').map((t, i) => i + 1),
        [text]
    );

    return (
        <div className={className || c.root}>
            {
                toggle && (
                    <span className={c.toggle} onClick={toggleVisible}>
                        <FaCode style={{marginRight: '.3em'}} />
                        {visible ? 'Hide Source' : 'View Source'}
                    </span>
                )
            }
            <div className={c.code} style={{display: visible ? '' : 'none'}}>
                <div className={c.gutter}>
                    {lineNumbers.map(i => <span key={i} className={c.lineNumber}>{i}</span>)}
                </div>
                <Refractor language={language} value={text} />
            </div>
        </div>
    );
};

SourceCode.defaultProps = {
    toggle: true,
    language: 'jsx',
};

export default SourceCode;
