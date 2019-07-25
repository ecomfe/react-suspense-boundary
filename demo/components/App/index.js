import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Simple from '../Simple';
import Multiple from '../Multiple';
import Nested from '../Nested';
import FunctionCache from '../FunctionCache';
import SelfLoading from '../SelfLoading';
import ManualControl from '../ManualControl';
import AsyncError from '../AsyncError';
import RelatedSource from '../RelatedSource';
import c from './index.less';

export default () => (
    <HashRouter>
        <div className={c.root}>
            <Header />
            <div className={c.content}>
                <Sidebar className={c.sidebar} />
                <main className={c.main}>
                    <Switch>
                        <Route path="/simple" component={Simple} />
                        <Route path="/multiple" component={Multiple} />
                        <Route path="/nested" component={Nested} />
                        <Route path="/function-cache" component={FunctionCache} />
                        <Route path="/self-loading" component={SelfLoading} />
                        <Route path="/manual-control" component={ManualControl} />
                        <Route path="/async-error" component={AsyncError} />
                        <Route path="/source/:filename" component={RelatedSource} />
                        <Redirect to="/simple" />
                    </Switch>
                </main>
            </div>
        </div>
    </HashRouter>
);
