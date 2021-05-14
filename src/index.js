import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './components/app-routes/AppRoutes';

import './style.scss';
import './img/favicons/favicons';

ReactDOM.render(<BrowserRouter><AppRoutes /></BrowserRouter>, document.getElementById('react-container'));
