// frontend/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import configureStore from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
    restoreCSRF();
    window.csrfFetch = csrfFetch;
    window.store = store;
    window.sessionActions = require('./store/session');  // Exposing session actions for testing
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ReduxProvider>
    </React.StrictMode>
);

