import React, {Suspense, lazy} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const Home = lazy(() => import('./routes/home/Home'))
const Event = lazy(() => import('./routes/event/Event'))

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/event/:eventCode">
            <Event />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
