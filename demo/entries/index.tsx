import {StrictMode} from 'react';
import {render} from 'react-dom';
import {HashRouter} from 'react-router-dom';
import App from '../components/App';

render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>,
    document.body.appendChild(document.createElement('div'))
);
