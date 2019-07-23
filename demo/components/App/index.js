import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Sidebar from '../Sidebar';
import Simple from '../Simple';
import Multiple from '../Multiple';
import Nested from '../Nested';
import FunctionCache from '../FunctionCache';
import SelfLoading from '../SelfLoading';
import ManualControl from '../ManualControl';
import c from './index.less';

export default () => (
    <BrowserRouter>
        <div className={c.root}>
            <Sidebar className={c.sidebar} />
            <main className={c.content}>
                <Switch>
                    <Route path="/simple" component={Simple} />
                    <Route path="/multiple" component={Multiple} />
                    <Route path="/nested" component={Nested} />
                    <Route path="/function-cache" component={FunctionCache} />
                    <Route path="/self-loading" component={SelfLoading} />
                    <Route path="/manual-control" component={ManualControl} />
                    <Redirect to="/simple" />
                </Switch>
            </main>
        </div>
    </BrowserRouter>
);
