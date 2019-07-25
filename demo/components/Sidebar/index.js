import {NavLink} from 'react-router-dom';
import {FaExternalLinkAlt} from 'react-icons/fa';
import c from './index.less';

const NavItem = ({external, ...props}) => {
    if (external) {
        return (
            <a
                className={c.navItem}
                target="_blank"
                rel="noopener noreferrer"
                href="https://reactjs.org/docs/react-api.html#reactsuspense"
            >
                {props.children}
                <FaExternalLinkAlt className={c.external} />
            </a>
        );
    }

    return <NavLink className={c.navItem} activeClassName={c.navItemCurrent} {...props} />;
};

export default ({className}) => (
    <aside className={className}>
        <h3 className={c.title}>Examples</h3>
        <nav>
            <NavItem to="/simple">Simple</NavItem>
            <NavItem to="/multiple">Multiple Async Components</NavItem>
            <NavItem to="/nested">Nested Boundary</NavItem>
            <NavItem to="/function-cache">Function Cache Mode</NavItem>
            <NavItem to="/self-loading">Loading On Self</NavItem>
            <NavItem to="/manual-control">Manual Expire And Refresh</NavItem>
            <NavItem to="/async-error">Async Error Boundary</NavItem>
        </nav>
        <h3 className={c.title}>Related Source</h3>
        <nav>
            <NavItem to="/source/HostInfo">HostInfo</NavItem>
            <NavItem to="/source/UserList">UserList</NavItem>
        </nav>
        <h3 className={c.title}>Resources</h3>
        <nav>
            <NavItem to="/readme">README</NavItem>
            <NavItem external to="https://reactjs.org/docs/react-api.html#reactsuspense">React Suspense</NavItem>
        </nav>
    </aside>
);
