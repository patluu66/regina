import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// import dotenv from 'dotenv';
// import errorReporter from './errorReporter'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
