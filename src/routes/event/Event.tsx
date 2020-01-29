import React from 'react'

import {
  useRouteMatch,
  useParams
} from 'react-router-dom'

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import ShareIcon from '@material-ui/icons/Share';
import HomeIcon from '@material-ui/icons/Home';

import {
  Switch,
  Route,
} from "react-router-dom";

import Dashboard from './Dashboard'
import AddPlay from './AddPlay'

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    eventContent: {
      marginTop: theme.spacing(1)
    },
  }),
);

const GET_EVENT = gql`
query ($eventCode: String!) {
  event (code: $eventCode) {
    id
    code
    name
  }
}
`

/* const AddFab: React.FC = () => { */
/*   const classes = useStyles(); */
/*   return <Fab className={classes.fab} color="primary" aria-label="add"> */
/*     <AddIcon /> */
/*   </Fab> */
/* } */

const Event: React.FC = () => {

  const {path} = useRouteMatch();

  const {eventCode} = useParams();
  const classes = useStyles();

  const {loading, error, data} = useQuery(GET_EVENT, {
    variables: {
      eventCode
    }
  })

  if (loading) {return <div>Loading...</div>}
  if (error) {return <div>todo 404</div>}


  const {name: eventName} = data.event

  return <div>
    <AppBar position="sticky">
      <Toolbar>
        <Hidden xsDown>
          <Typography variant="h6" className={classes.title}>
            {eventName}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography variant="h6" className={classes.title}>
            {eventCode}
          </Typography>
        </Hidden>
        <Hidden xsDown>
          <Typography variant="h6">
            {eventCode}&nbsp;
        </Typography>
        </Hidden>
        <IconButton color="inherit">
          <HomeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Container
      maxWidth="xl"
      className={classes.eventContent}
    >
      <Switch>
        <Route exact path={path}>
          <Dashboard />
        </Route>
        <Route path={`${path}/play/add`}>
          <AddPlay />
        </Route>
      </Switch>
    </Container>
  </div>
}

export default Event
