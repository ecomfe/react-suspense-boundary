import {FaReact, FaGithub} from 'react-icons/fa';
import c from './index.less';

export default () => (
    <header className={c.root}>
        <h1 className={c.title}>
            <FaReact className={c.logo} />
            React Suspense Boundary
        </h1>
        <nav>
            <a className={c.link} href="https://github.com/ecomfe/react-suspense-boundary">
                <FaGithub style={{marginRight: '.3em'}} />Github
            </a>
        </nav>
    </header>
);
