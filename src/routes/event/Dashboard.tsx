import React from 'react';
import {Link, useParams, useRouteMatch} from 'react-router-dom'

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

// @ts-ignore
import Websocket from 'react-websocket';

import {withStyles, createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
/* import Divider from '@material-ui/core/Divider'; */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';

import StarsIcon from '@material-ui/icons/Stars';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';

import FlipMove from 'react-flip-move';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

/* import Button from '@material-ui/core/Button'; */
/* import ShareIcon from '@material-ui/icons/Share'; */

/* const useStyles = makeStyles((theme: Theme) => createStyles({ */
/*   button: { */
/*     margin: theme.spacing(1), */
/*     verticalAlign: 'center' */
/*   }, */
/* })); */

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -10,
      top: 20,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }),
)(Badge);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    scoreDisplay: {
      marginTop: theme.spacing(0.5)
    },
    pointsDisplay: {
      color: '#d4af37'
    },
    winDisplay: {
      color: 'green'
    },
    lossDisplay: {
      color: 'red'
    },
    ratioDisplay: {
      color: 'gray'
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);


const GET_EVENT = gql`
query ($eventCode: String!) {
  event (code: $eventCode) {
    id
    code
    name
    players {
      id
      name
      eventPlayCount (eventCode: $eventCode)
      eventWinCount (eventCode: $eventCode)
      eventLossCount (eventCode: $eventCode)
      eventTotalScore (eventCode: $eventCode)
    }
  }
}
`

const nth = (n: number) => ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th"

const Dashboard: React.FC = () => {

  const {url} = useRouteMatch();

  const classes = useStyles();
  const {eventCode} = useParams()
  const {loading, error, data, refetch} = useQuery(GET_EVENT, {
    variables: {
      eventCode
    }
  })

  if (loading) {return <div>Loading...</div>}
  if (error) {return <div>Unable to load event</div>}

  const {event} = data
  const {name, code, players} = event
  const processedPlayers = [...players].sort((a, b) => a.eventTotalScore > b.eventTotalScore ? -1 : 1).map(player => ({
    ...player,
    initial: player.name.slice(0, 1).toUpperCase(),
    score: Number(player.eventTotalScore).toFixed(0),
    wins: player.eventWinCount,
    losses: player.eventLossCount,
    winLossPercent: `${isNaN(player.eventWinCount / player.eventPlayCount) ? 0 : Math.min(((player.eventWinCount / player.eventPlayCount) * 100), 100).toFixed(0) || 0}% `
  }))

  const eventUpdated = (data: string) => {
    const result = JSON.parse(data)
    if (result.type === 'event.updated') {
      refetch()
    }
  }

  return (
    <React.Fragment>

      <Websocket url={`${process.env.REACT_APP_TOURNAMENT_WEBSOCKET_URL}/event/${eventCode}/`} onMessage={eventUpdated} />

      {/* <Typography variant="h4" gutterBottom> */}
      {/*   Leaderboard */}
      {/* </Typography> */}

      {/* {JSON.stringify(data)} */}

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <List className={classes.root}>
          <FlipMove>
            {processedPlayers.map((player, index) => <div key={`${player.id}`}><ListItem alignItems="flex-start">
              <ListItemAvatar style={{marginRight: '25px'}}>
                {/* <Grid */}
                {/*   container */}
                {/*   direction="column" */}
                {/*   justify="center" */}
                {/*   alignItems="center" */}
                {/*   spacing={2} */}
                {/*   xs={12} */}
                {/* > */}
                <StyledBadge badgeContent={`${index + 1}${(nth(index + 1))}`} color='secondary'>
                  <Avatar alt={player.name} src="/broken-image.jpg">
                    {player.initial}
                  </Avatar>
                </StyledBadge>
                {/* <Typography variant="caption" color="textSecondary"> */}
                {/*   {index + 1}{(nth(index + 1))} */}
                {/* </Typography> */}
                {/* </Grid> */}
              </ListItemAvatar>
              <ListItemText
                primary={<React.Fragment>
                  {player.name}
                  {/* &mdash; {index + 1}{(nth(index + 1))} */}
                </React.Fragment>}
                secondary={
                  <Grid
                    container
                    alignItems="center"
                    spacing={1}
                    className={classes.scoreDisplay}
                  >
                    <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        style={{color: 'black'}}
                      >
                        <StarsIcon className={classes.pointsDisplay} fontSize="small" />&nbsp;{player.score}
                      </Grid>
                    </Grid>
                    <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        className={classes.winDisplay}
                      >
                        <ThumbUpIcon fontSize="small" />&nbsp;&nbsp;{player.wins}
                      </Grid>
                    </Grid>
                    <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        className={classes.lossDisplay}
                      >
                        <ThumbDownIcon fontSize="small" />&nbsp;&nbsp;{player.losses}
                      </Grid>
                    </Grid>
                    <Grid item xs={3} sm={3} md={2} lg={1} xl={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        className={classes.ratioDisplay}
                      >
                        <ThumbsUpDownIcon fontSize="small" />&nbsp;&nbsp;{player.winLossPercent}
                      </Grid>
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
              <Divider variant="inset" component="li" />
            </div>)
            }
          </FlipMove>
        </List>
      </Grid>
      <Link to={`${url}/play/add`}>
        <Fab className={classes.fab} color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Link>
    </React.Fragment >
  )
}
export default Dashboard
