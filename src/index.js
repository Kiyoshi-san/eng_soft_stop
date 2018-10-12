import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import config from 'react-global-configuration';

import './css/index.css';
import App from './components/App';
import configuration from './config/config';
import registerServiceWorker from './registerServiceWorker';

config.set(configuration );

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();