import React, {Suspense, lazy} from 'react';

import Loading from './Loading'
import NotFound from './NotFound'

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
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/event/:eventCode">
            <Event />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
