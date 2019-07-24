import {NavLink} from 'react-router-dom';
import c from './index.less';

const NavItem = props => <NavLink className={c.navItem} activeClassName={c.navItemCurrent} {...props} />;

export default ({className}) => (
    <aside className={className}>
        <nav>
            <NavItem to="/simple">Simple</NavItem>
            <NavItem to="/multiple">Multiple Async Components</NavItem>
            <NavItem to="/nested">Nested Boundary</NavItem>
            <NavItem to="/function-cache">Function Cache Mode</NavItem>
            <NavItem to="/self-loading">Loading On Self</NavItem>
            <NavItem to="/manual-control">Manual Expire And Refresh</NavItem>
        </nav>
    </aside>
);
