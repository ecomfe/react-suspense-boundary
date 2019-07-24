import {useReducer, useMemo} from 'react';
import {FaCode} from 'react-icons/fa';
import Refractor from 'react-refractor';
import jsx from 'refractor/lang/jsx';
import 'prism-themes/themes/prism-vs.css';
import c from './index.less';

Refractor.registerLanguage(jsx);

export default ({source}) => {
    const [visible, toggle] = useReducer(v => !v, false);
    const text = useMemo(
        () => source
            .replace('../../../src', 'react-suspense-boundary')
            .replace(/import SourceCode from.+\n/, '')
            .replace(/\/\/ eslint-disable-next-line import\/no-webpack-loader-syntax.+\n/, '')
            .replace(/import source from '..\/SourceCode\/loader.+\n/, '')
            .replace(/\s+<SourceCode .+/, '')
            .replace(/\n{3,}/, '\n\n'),
        [source]
    );

    return (
        <div className={c.root}>
            <span className={c.toggle} onClick={toggle}>
                <FaCode style={{marginRight: '.3em'}} />
                {visible ? 'Hide Source' : 'View Source'}
            </span>
            <div className={c.code} style={{display: visible ? 'block' : 'none'}}>
                <Refractor language="jsx" value={text} />
            </div>
        </div>
    );
};
