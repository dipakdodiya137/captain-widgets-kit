import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store.js'; // Import the store from store.js
import Cwk_app from "./cwk_app.js";

/**
 * Import the stylesheet for the plugin.
 */
// import './style/variables.scss';
import './style/global.scss';
// import './style/dashboard.scss';

const container = document.getElementById('captain-widgets-kit-app');

if( container ){
    // Create a root for React to render into
    const root = createRoot(container);

    root.render(
        <Provider store={store}>
            <Cwk_app />
        </Provider>
    );
}
