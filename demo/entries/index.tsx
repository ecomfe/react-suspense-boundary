import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import App from '../components/App/index.js';
import '../styles/index.js';

const root = createRoot(document.body.appendChild(document.createElement('div')));
root.render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>
);
