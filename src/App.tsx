import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from './routes/home/Home'
import Event from './routes/event/Event'


const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/event/:eventCode">
          <Event />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
