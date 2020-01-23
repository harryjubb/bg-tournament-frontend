import React from 'react';

import Container from '@material-ui/core/Container'
import {makeStyles, withStyles} from '@material-ui/core/styles';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './routes/home/Home'
import Dashboard from './routes/event/Dashboard'


const useStyles = makeStyles(theme => ({
  cardHeader: {
    paddingTop: 5,
  },
  container: {
    paddingTop: 20,
  },
  gameImage: {
    height: 200,
    backgroundSize: 'contain'
  },
  title: {
    flexGrow: 1,
  },
}));

const App: React.FC = () => {
  const classes = useStyles()

  return (
    <Container
      maxWidth="xl"
    >
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/event/:eventCode" children={() => <Dashboard />} />
          <Route path="/event/:eventCode/play/add" children={() => <div>add play here</div>} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
