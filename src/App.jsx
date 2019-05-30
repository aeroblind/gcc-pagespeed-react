import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
// import AppRoutes from './routes/AppRoutes';

import Home from './pages/home';
import Website from './pages/website';

//  bootstrap
import 'jquery/dist/jquery.min';
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/css/bootstrap.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('root');
  if (target) {
    ReactDOM.render(
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/sites/:dbRefStr" component={Website}/>
        </div>
      </Router>,
      target,
    );
  } else {
    console.warn('tried to load React and failed :(');
  }
});
