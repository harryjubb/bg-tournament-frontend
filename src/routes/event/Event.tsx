import React, {Suspense, lazy} from 'react';
import {Helmet} from "react-helmet";

import {
  useRouteMatch,
  useParams,
  useHistory,
  Link as RouterLink
} from 'react-router-dom'

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {
  Switch,
  Route,
} from "react-router-dom";

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const Dashboard = lazy(() => import('./Dashboard'))
const AddPlay = lazy(() => import('./AddPlay'))

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
    mr: {
      marginRight: theme.spacing(1)
    }
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

  const history = useHistory()
  const {path} = useRouteMatch();

  const {eventCode} = useParams();
  const classes = useStyles();

  const {loading, error, data} = useQuery(GET_EVENT, {
    variables: {
      eventCode
    }
  })

  if (loading) {return <div>Loading...</div>}
  if (error) {return <div>Event not found</div>}


  const {name: eventName} = data.event

  return <div>
    <AppBar position="sticky">
      <Helmet>
        <title>{eventName}</title>
        <meta
          name="description"
          content={`Tournament event: ${eventName}`}
        />
      </Helmet>
      <Toolbar>
        <Hidden xsDown>
          <Typography variant="h6" className={classes.title}>
            <Link color="inherit" component={RouterLink} to={`/event/${eventCode}`}>
              {eventName}
            </Link>
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography variant="h6" className={classes.title}>
            <Link color="inherit" component={RouterLink} to={`/event/${eventCode}`}>
              {eventCode}
            </Link>
          </Typography>
        </Hidden>
        <Hidden xsDown>
          <Typography variant="h6" className={classes.mr}>
            <Link color="inherit" component={RouterLink} to={`/event/${eventCode}`}>
              {eventCode}
            </Link>
          </Typography>
        </Hidden>
        <IconButton onClick={() => history.push('/')} color="inherit">
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Container
      maxWidth="xl"
      className={classes.eventContent}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path={path}>
            <Dashboard />
          </Route>
          <Route path={`${path}/play/add`}>
            <AddPlay />
          </Route>
        </Switch>
      </Suspense>
    </Container>
  </div>
}

export default Event
