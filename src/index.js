import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './components/_App';

import './style.scss';
import './img/favicons/favicons';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('react-container'));
