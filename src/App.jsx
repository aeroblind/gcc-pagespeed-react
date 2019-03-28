require('dotenv').config();
import React from 'react';
import ReactDOM from 'react-dom';
// import {BrowserRouter} from 'react-router-dom';
// import AppRoutes from './routes/AppRoutes';

import Home from './pages/home';

document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('root');
  if (target) {
    ReactDOM.render(
      <Home />,
      target,
    );
  } else {
    console.warn('tried to load React and failed :(');
  }
});
